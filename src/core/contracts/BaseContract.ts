import { NameSkyUser } from '../NameSkyUser';

export type BaseContractOptions = {
  contractId: string;
  user: NameSkyUser;
};

export abstract class BaseContract {
  contractId: string;
  user: NameSkyUser;

  protected constructor(options: BaseContractOptions) {
    const { contractId, user } = options;
    this.contractId = contractId;
    this.user = user;
  }
}
