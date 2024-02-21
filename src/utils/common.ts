import { Amount } from 'multi-transaction';

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parse(0.0125, 'NEAR');
export const DEFAULT_APPROVAL_STORAGE_DEPOSIT = Amount.parse(0.005, 'NEAR');
export const FEE_DIVISOR = 10000;
export const ACTION_MAX_NUM = 100;
export const MAX_TIMEOUT = 2147483647;

export function moveRegistrantPublicKeyToEnd(registrantPublicKey: string, publicKeys: string[]): string[] {
  const result: string[] = [];
  for (const publicKey of publicKeys) {
    if (publicKey !== registrantPublicKey) {
      result.push(publicKey);
    }
  }
  result.push(registrantPublicKey);
  return result;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function wait<T>(f: () => Promise<T>, timeout: number = MAX_TIMEOUT): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const reject = async () =>
    new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(`Exceed max timeout: ${timeout}`), timeout);
    });

  return Promise.race([reject(), f()]).finally(() => clearTimeout(timeoutId));
}
