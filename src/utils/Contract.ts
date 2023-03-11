import { MultiSendWalletSelector } from 'multi-transaction';

export class Contract {
  contractId: string;
  selector: MultiSendWalletSelector;

  constructor(contractId: string, selector: MultiSendWalletSelector) {
    this.contractId = contractId;
    this.selector = selector;
  }
}
