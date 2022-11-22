import {Account} from "near-api-js";
import {SignAndSendTransactionOptions} from "near-api-js/lib/account";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {Modify} from "@near-wallet-selector/core/lib/utils.types";
import {BaseArgs} from "../../near-transaction/types/common";
import {BlockReference} from "near-api-js/lib/providers/provider";

export type MultiSendAccount = Modify<Account, {
  signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>
}>

export interface ViewOptions<Args extends BaseArgs> {
  contractId: string
  methodName: string,
  args: Args
  blockQuery?: BlockReference
}
