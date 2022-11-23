import {
  DeleteAccountParams,
  AddKeyParams,
  DeleteKeyParams,
  DeployContractParams,
  StakeParams,
  FunctionCallParams,
  TransferParams
} from "../types/action";
import {
  AddKeyActionLike,
  CreateAccountActionLike,
  DeleteAccountActionLike,
  DeleteKeyActionLike,
  DeployContractActionLike,
  FunctionCallActionLike,
  StakeActionLike,
  TransferActionLike
} from "../types/action";

export class ActionFactory {
  private constructor() {}

  static createAccount(): CreateAccountActionLike {
    return {
      type: "CreateAccount",
      params: {}
    }
  }

  static deleteAccount(params: DeleteAccountParams): DeleteAccountActionLike {
    return {
      type: "DeleteAccount",
      params
    }
  }

  static addKey(params: AddKeyParams): AddKeyActionLike {
    return {
      type: "AddKey",
      params
    }
  }

  static deleteKey(params: DeleteKeyParams): DeleteKeyActionLike {
    return {
      type: "DeleteKey",
      params
    }
  }

  static deployContract(params: DeployContractParams): DeployContractActionLike {
    return {
      type: "DeployContract",
      params
    }
  }

  static stake(params: StakeParams): StakeActionLike {
    return {
      type: "Stake",
      params
    }
  }

  static functionCall(params: FunctionCallParams): FunctionCallActionLike {
    return {
      type: "FunctionCall",
      params
    }
  }

  static transfer(params: TransferParams): TransferActionLike {
    return {
      type: "Transfer",
      params
    }
  }
}
