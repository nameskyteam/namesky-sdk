import {Account} from "near-api-js";
import {SignAndSendTransactionOptions} from "near-api-js/lib/account";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {Modify} from "@near-wallet-selector/core/lib/utils.types";

export type Merge<T, U> = T & U

export type BaseArgs = object

export type MultiSendAccount = Modify<Account, { signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> }>
