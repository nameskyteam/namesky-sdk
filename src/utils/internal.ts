import { BigNumber, BigNumberLike, BlockQuery } from 'multi-transaction';
import { PublicKey } from 'near-api-js/lib/utils';
import { PENDING_REGISTRANT_ID_PREFIX } from './constants';

export function optimistic(): BlockQuery {
  return { finality: 'optimistic' };
}

export function calcInsufficientBalance(current: BigNumberLike, required: BigNumberLike): BigNumber {
  return BigNumber.max(BigNumber(required).minus(current), 0);
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
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
