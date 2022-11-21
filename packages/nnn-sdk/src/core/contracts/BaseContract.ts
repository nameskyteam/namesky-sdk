import {WalletSelectorPlus} from "../../utils/wallet-selector-plus/types/enhancement";

export class BaseContract {
  contractId: string
  selector: WalletSelectorPlus

  constructor(contractId: string, selector: WalletSelectorPlus) {
    this.contractId = contractId
    this.selector = selector
  }
}
