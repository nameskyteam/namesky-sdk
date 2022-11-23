import {Account} from "near-api-js";
import {NearTransaction} from "../near-transaction/core/NearTransaction";
import {parseOutcomeValue} from "../near-transaction/utils/outcome";

export class MultiSendAccount extends Account {
  async send<Value>(transaction: NearTransaction): Promise<Value> {
    let outcome = null
    for (const nearApiJsTransaction of transaction.parseNearApiJsTransactions()) {
      outcome = await this.signAndSendTransaction(nearApiJsTransaction)
    }
    return parseOutcomeValue(outcome!)
  }
}
