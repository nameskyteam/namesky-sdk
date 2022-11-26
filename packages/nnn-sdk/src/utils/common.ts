import {Amount} from "./multi-transaction";
import Big from "big.js";

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:'
export const DEFAULT_STORAGE_DEPOSIT = Amount.parseYoctoNear('0.01')
export const DEFAULT_MINT_FEE = Amount.parseYoctoNear('0.1')

export function subGteZero(a: Big, b: Big): Big {
  const sub = a.sub(b)
  return sub.gte(0) ? sub : Big(0)
}
