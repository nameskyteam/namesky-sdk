import {Amount} from "./multi-transaction";
import Big from "big.js";
import {base58CryptoHash, sha256Encoding} from "./crypto";

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:'
export const DEFAULT_STORAGE_DEPOSIT = Amount.parseYoctoNear('0.01')
export const DEFAULT_MINT_FEE = Amount.parseYoctoNear('0.1')

export function bigMax(...values: Big[]): Big {
  return values.sort((a, b) => {
    if (a.gt(b)) {
      return -1
    }
    return 1
  })[0]
}

export function bigMin(...values: Big[]): Big {
  return values.sort((a, b) => {
    if (a.gte(b)) {
      return 1
    }
    return -1
  })[0]
}

export function getBase58CodeHash(code: Uint8Array): string {
  const hash = sha256Encoding(code)
  return base58CryptoHash(hash)
}
