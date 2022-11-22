import {WalletSelectorPlus} from "./wallet-selector-plus/types/enhancement";

export class BaseContract {
  contractId: string
  selector: WalletSelectorPlus

  constructor(contractId: string, selector: WalletSelectorPlus) {
    this.contractId = contractId
    this.selector = selector
  }
}
