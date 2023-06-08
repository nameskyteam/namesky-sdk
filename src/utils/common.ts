import { Amount } from 'multi-transaction';
import { BigSource } from 'big.js';

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.0125);
export const DEFAULT_APPROVAL_STORAGE_DEPOSIT = Amount.parseYoctoNear(0.005);
export const NUM_BYTES_DATA_LEN = 4;
export const FEE_DIVISOR = 10000;
export const ACTION_MAX_NUM = 100;

export function buildContractStateKeysRaw(state: { key: Buffer; value: Buffer }[]): Buffer {
  return state.reduce((pre, { key }) => {
    // 4 bytes for key len
    const keyLen = Buffer.alloc(NUM_BYTES_DATA_LEN);
    keyLen.writeUint32LE(key.length);
    // borsh like, key_len + key_data
    return Buffer.concat([pre, keyLen, key]);
  }, Buffer.alloc(0));
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

export function max(...ns: Amount[]): Amount {
  return ns.sort((n1, n2) => n2.cmp(n1))[0];
}

export function min(...ns: Amount[]): Amount {
  return ns.sort((n1, n2) => n1.cmp(n2))[0];
}
