import { NameSkySigner } from '../NameSkySigner';

export type BaseContractOptions = {
  contractId: string;
  signer: NameSkySigner;
};

export abstract class BaseContract {
  contractId: string;
  signer: NameSkySigner;

  protected constructor(options: BaseContractOptions) {
    const { contractId, signer } = options;
    this.contractId = contractId;
    this.signer = signer;
  }
}
