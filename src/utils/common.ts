import { Amount } from 'multi-transaction';

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.0125);
export const DEFAULT_APPROVAL_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.005);
export const FEE_DIVISOR = 10000;
export const ACTION_MAX_NUM = 100;

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
