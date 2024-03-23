import { BigNumber, BigNumberLike } from 'multi-transaction';
import { PublicKey } from 'near-api-js/lib/utils';
import { PENDING_REGISTRANT_ID_PREFIX } from './constants';

export function endless(): never {
  while (true) {
    // endless loop
  }
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function calcInsufficientBalance(current: BigNumberLike, target: BigNumberLike): BigNumber {
  return BigNumber.max(BigNumber(target).minus(current), 0);
}

export function getPendingRegistrantId(publicKey: string): string {
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
