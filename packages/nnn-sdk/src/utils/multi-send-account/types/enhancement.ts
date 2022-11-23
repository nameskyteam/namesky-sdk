import {MultiTransaction} from "../../multi-transaction/core/MultiTransaction";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {SignAndSendTransactionOptions} from "near-api-js/lib/account";

export interface AccountEnhancement {
    signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>
    multiSend<Value>(transaction: MultiTransaction): Promise<Value>
}
