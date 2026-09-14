import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/* ---------------------------------------------------------------------------
 * STORAGE ADAPTER
 *
 * All persisted data goes through this interface. The default adapter writes
 * JSON files in /data — zero infrastructure, works perfectly in local dev and
 * on any host with a writable disk.
 *
 * IMPORTANT for production: Vercel's serverless filesystem is read-only and
 * ephemeral, so admin writes will NOT persist there with the file adapter.
 * To go live with a working admin endpoint, implement `Store` against GitHub's
 * contents API or a free DB (Supabase / Turso) and swap the export at the
 * bottom of this file. Nothing else in the codebase changes.
 * See docs/next-steps.md §11.
 * ------------------------------------------------------------------------- */

export interface Store {
  read<T>(collection: string, fallback: T): Promise<T>;
  write<T>(collection: string, data: T): Promise<void>;
}

const DATA_DIR = path.join(process.cwd(), 'data');

/** Serialises writes in-process so two concurrent requests cannot interleave. */
const locks = new Map<string, Promise<unknown>>();

function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

class FileStore implements Store {
  private file(collection: string) {
    if (!/^[a-z0-9-]+$/.test(collection)) throw new Error('Invalid collection name');
    return path.join(DATA_DIR, `${collection}.json`);
  }

  async read<T>(collection: string, fallback: T): Promise<T> {
    try {
      const raw = await fs.readFile(this.file(collection), 'utf8');
      return JSON.parse(raw) as T;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') return fallback;
      // A malformed file should not take the whole site down.
      console.error(`[store] failed to read ${collection}:`, (err as Error).message);
      return fallback;
    }
  }

  async write<T>(collection: string, data: T): Promise<void> {
    const target = this.file(collection);
    await withLock(target, async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      // Atomic: write to a unique temp file in the same directory, then rename.
      const tmp = `${target}.${crypto.randomBytes(6).toString('hex')}.tmp`;
      try {
        await fs.writeFile(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
        await fs.rename(tmp, target);
      } catch (err) {
        await fs.rm(tmp, { force: true }).catch(() => undefined);
        throw err;
      }
    });
  }
}

export const store: Store = new FileStore();

/** Whether the current runtime can actually persist writes. */
export function isWritableRuntime(): boolean {
  return process.env.VERCEL !== '1';
}
