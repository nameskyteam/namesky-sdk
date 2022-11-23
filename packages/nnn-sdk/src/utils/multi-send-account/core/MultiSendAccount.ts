import {Account} from "near-api-js";
import {MultiTransaction} from "../../multi-transaction/core/MultiTransaction";
import {parseOutcomeValue} from "../../multi-transaction/utils/outcome";
import {AccountEnhancement} from "../types/enhancement";

/**
 * Enhancement of `Account` based on `MultiTransaction`
 */
export class MultiSendAccount extends Account implements AccountEnhancement {
  async multiSend<Value>(transaction: MultiTransaction): Promise<Value> {
    let outcome = null
    for (const nearApiJsTransaction of transaction.parseNearApiJsTransactions()) {
      outcome = await this.signAndSendTransaction(nearApiJsTransaction)
    }
    return parseOutcomeValue(outcome!)
  }
}
