import {Account} from "near-api-js";
import {MultiTransaction} from "../../multi-transaction/core/MultiTransaction";
import {parseOutcomeValue} from "../../multi-transaction/utils/outcome";
import {AccountEnhancement} from "../types/enhancement";
import {SignAndSendTransactionOptions} from "near-api-js/lib/account";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";

/**
 * Enhancement of `Account` based on `MultiTransaction`
 */
export class MultiSendAccount extends Account implements AccountEnhancement {
  async signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
    return super.signAndSendTransaction(options)
  }

  async multiSend<Value>(transaction: MultiTransaction): Promise<Value> {
    let outcome = null
    for (const nearApiJsTransaction of transaction.parseNearApiJsTransactions()) {
      outcome = await this.signAndSendTransaction(nearApiJsTransaction)
    }
    return parseOutcomeValue(outcome!)
  }
}
