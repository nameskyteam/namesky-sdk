import {BaseArgs, FunctionViewOptions} from "../../multi-transaction";
import {BlockReference} from "near-api-js/lib/providers/provider";

export interface SelectorFunctionViewOptions<Args extends BaseArgs> extends FunctionViewOptions<Args> {
  contractId: string
  blockQuery?: BlockReference
}

export interface SelectorMultiSendOptions {
  walletId?: string
  callbackUrl?: string
}
