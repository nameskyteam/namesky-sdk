import {SignAndSendTransactionOptions} from "near-api-js/lib/account";
import {MultiTransaction} from "../../multi-transaction";

export interface SignAndSendTransactionParams extends SignAndSendTransactionOptions {}

export interface SignAndSendTransactionsParams {
  transactions: SignAndSendTransactionParams[]
}

export interface MultiSendOptions {
  transaction: MultiTransaction
}
