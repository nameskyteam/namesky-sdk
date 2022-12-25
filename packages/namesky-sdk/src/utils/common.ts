import { Amount } from './multi-transaction';
import { base58CryptoHash, sha256 } from './crypto';

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.02);
export const DEFAULT_APPROVAL_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.005);
export const DEFAULT_MINT_FEE = Amount.parseYoctoNear(0.1);
export const NUM_BYTES_DATA_LEN = 4;

export function getBase58CodeHash(code: Buffer): string {
  const hash = sha256(code);
  return base58CryptoHash(hash);
}
