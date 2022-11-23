import {SignAndSendTransactionOptions} from "near-api-js/lib/account";

export interface SignAndSendTransactionParams extends SignAndSendTransactionOptions {}

export interface SignAndSendTransactionsParams {
  transactions: SignAndSendTransactionParams[]
}
