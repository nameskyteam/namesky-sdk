import {BaseArgs} from "../../multi-transaction";
import {BlockReference} from "near-api-js/lib/providers/provider";

export interface ViewOptions<Args extends BaseArgs> {
  contractId: string
  methodName: string
  args?: Args
  blockQuery?: BlockReference
}

export interface SelectorMultiSendOptions {
  walletId?: string
  callbackUrl?: string
}
