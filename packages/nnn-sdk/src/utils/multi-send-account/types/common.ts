import {SignAndSendTransactionOptions} from "near-api-js/lib/account";
import {BaseArgs, FunctionViewOptions} from "../../multi-transaction";
import {BlockReference} from "near-api-js/lib/providers/provider";

export interface SignAndSendTransactionParams extends SignAndSendTransactionOptions {}

export interface SignAndSendTransactionsParams {
  transactions: SignAndSendTransactionParams[]
}

export interface AccountFunctionViewOptions<Args extends BaseArgs> extends FunctionViewOptions<Args> {
  contractId: string
  blockQuery?: BlockReference
}
