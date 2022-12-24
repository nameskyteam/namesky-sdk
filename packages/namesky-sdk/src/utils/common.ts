import { Amount } from './multi-transaction';
import Big from 'big.js';
import { base58CryptoHash, sha256 } from './crypto';

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.02);
export const DEFAULT_APPROVAL_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.005);
export const DEFAULT_MINT_FEE = Amount.parseYoctoNear(0.1);
export const NUM_BYTES_DATA_LEN = 4;

export function bigMax(...values: Big[]): Big {
  return values.sort((a, b) => {
    if (a.gt(b)) {
      return -1;
    }
    return 1;
  })[0];
}

export function bigMin(...values: Big[]): Big {
  return values.sort((a, b) => {
    if (a.gte(b)) {
      return 1;
    }
    return -1;
  })[0];
}

export function getBase58CodeHash(code: Buffer): string {
  const hash = sha256(code);
  return base58CryptoHash(hash);
}
