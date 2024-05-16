import sha256 from 'sha256';
import base58 from 'bs58';
import { MAX_TIMEOUT } from './constants';
import { Buffer } from 'buffer';

export function base58CodeHash(code: Buffer): string {
  const hash = Buffer.from(sha256(code), 'hex');
  return base58.encode(hash);
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function wait<T>(f: () => Promise<T>, timeout: number = MAX_TIMEOUT): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const reject = async (): Promise<never> =>
    await new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(`Exceed max timeout: ${timeout}`), timeout);
    });

  return Promise.race([reject(), f()]).finally(() => clearTimeout(timeoutId));
}

export function jsonSerialize<T>(data: T): string {
  return JSON.stringify(data);
}

export function jsonDeserialize<T>(data: string): T {
  return JSON.parse(data);
}
