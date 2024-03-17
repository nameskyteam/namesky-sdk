import { NameSkySigner } from '../NameSkySigner';

export abstract class BaseContract {
  contractId: string;
  signer: NameSkySigner;

  constructor(contractId: string, signer: NameSkySigner) {
    this.contractId = contractId;
    this.signer = signer;
  }
}
