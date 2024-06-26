import { BigNumber, Numeric } from 'multi-transaction';
import { PublicKey } from 'near-api-js/lib/utils';
import { PENDING_REGISTRANT_ID_PREFIX } from './constants';

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function calcInsufficientBalance(current: Numeric, target: Numeric): BigNumber {
  return BigNumber.max(BigNumber(target).minus(current), 0);
}

export function buildPendingRegistrantId(publicKey: string): string {
  return PENDING_REGISTRANT_ID_PREFIX + PublicKey.fromString(publicKey).toString();
}

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
