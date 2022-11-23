import {BaseArgs} from "../../multi-transaction/types/common";
import {BlockReference} from "near-api-js/lib/providers/provider";
import {MultiTransaction} from "../../multi-transaction/core/MultiTransaction";

export interface ViewOptions<Args extends BaseArgs> {
  contractId: string
  methodName: string
  args: Args
  blockQuery?: BlockReference
}

export interface MultiSendOptions {
  transaction: MultiTransaction
  callbackUrl?: string
}
