import {MultiTransaction} from "../../multi-transaction/core/MultiTransaction";

export interface AccountEnhancement {
    multiSend<Value>(transaction: MultiTransaction): Promise<Value>
}
