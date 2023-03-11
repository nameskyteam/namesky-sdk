import { Amount } from 'multi-transaction';

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.02);
export const DEFAULT_APPROVAL_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.005);
export const DEFAULT_MINT_FEE = Amount.parseYoctoNear(0.1);
export const NUM_BYTES_DATA_LEN = 4;

export function buildContractStateKeysRaw(state: { key: Buffer; value: Buffer }[]): Buffer {
  return state.reduce((pre, { key }) => {
    // 4 bytes for key len
    const keyLen = Buffer.alloc(NUM_BYTES_DATA_LEN);
    keyLen.writeUint32LE(key.length);
    // borsh like, key_len + key_data
    return Buffer.concat([pre, keyLen, key]);
  }, Buffer.alloc(0));
}
