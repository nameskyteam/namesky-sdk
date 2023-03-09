import { WalletSelectorPlus } from './wallet-selector-plus';

export class Contract {
  contractId: string;
  selector: WalletSelectorPlus;

  constructor(contractId: string, selector: WalletSelectorPlus) {
    this.contractId = contractId;
    this.selector = selector;
  }
}
