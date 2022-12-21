import {
  DeleteAccountParams,
  AddKeyParams,
  DeleteKeyParams,
  DeployContractParams,
  StakeParams,
  FunctionCallParams,
  TransferParams,
} from '../types';
import {
  AddKeyAction,
  CreateAccountAction,
  DeleteAccountAction,
  DeleteKeyAction,
  DeployContractAction,
  FunctionCallAction,
  StakeAction,
  TransferAction,
} from '../types';

export class ActionFactory {
  private constructor() {}

  static createAccount(): CreateAccountAction {
    return {
      type: 'CreateAccount',
      params: {},
    };
  }

  static deleteAccount(params: DeleteAccountParams): DeleteAccountAction {
    return {
      type: 'DeleteAccount',
      params,
    };
  }

  static addKey(params: AddKeyParams): AddKeyAction {
    return {
      type: 'AddKey',
      params,
    };
  }

  static deleteKey(params: DeleteKeyParams): DeleteKeyAction {
    return {
      type: 'DeleteKey',
      params,
    };
  }

  static deployContract(params: DeployContractParams): DeployContractAction {
    return {
      type: 'DeployContract',
      params,
    };
  }

  static stake(params: StakeParams): StakeAction {
    return {
      type: 'Stake',
      params,
    };
  }

  static functionCall(params: FunctionCallParams): FunctionCallAction {
    return {
      type: 'FunctionCall',
      params,
    };
  }

  static transfer(params: TransferParams): TransferAction {
    return {
      type: 'Transfer',
      params,
    };
  }
}
