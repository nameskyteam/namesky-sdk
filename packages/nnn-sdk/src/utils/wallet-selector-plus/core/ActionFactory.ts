import {
  DeleteAccountOptions,
  AddKeyOptions,
  DeleteKeyOptions,
  DeployContractOptions,
  StakeOptions,
  FunctionCallOptions,
  TransferOptions,
  BaseArgs
} from "../types/options";
import {Gas} from "../utils/Gas";
import {Amount} from "../utils/Amount";
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

  static transfer({amount}: TransferOptions): TransferActionLike {
    return {
      type: "Transfer",
      params: {
        amount
      }
    }
  }

  static functionCall<Args extends BaseArgs>({
    methodName,
    args,
    gas,
    attachedDeposit
}: FunctionCallOptions<Args>): FunctionCallActionLike {
    return {
      type: "FunctionCall",
      params: {
        methodName,
        args: args ?? {},
        gas: gas ?? Gas.DEFAULT,
        attachedDeposit: attachedDeposit ?? Amount.ZERO,
      }
    }
  }

  static deployContract({code}: DeployContractOptions): DeployContractActionLike {
    return {
      type: "DeployContract",
      params: {
        code
      }
    }
  }

  static stake({amount, publicKey}: StakeOptions): StakeActionLike {
    return {
      type: "Stake",
      params: {
          amount,
          publicKey
      }
    }
  }

  static createAccount(): CreateAccountActionLike {
    return {
      type: "CreateAccount",
      params: {}
    }
  }

  static deleteAccount({beneficiaryId}: DeleteAccountOptions): DeleteAccountActionLike {
    return {
      type: "DeleteAccount",
      params: {
        beneficiaryId
      }
    }
  }

  static addKey({publicKey, permission, nonce}: AddKeyOptions): AddKeyActionLike {
    return {
      type: "AddKey",
      params: {
        publicKey,
        accessKey: {
          permission
        },
        nonce
      }
    }
  }

  static deleteKey({publicKey}: DeleteKeyOptions): DeleteKeyActionLike {
    return {
      type: "DeleteKey",
      params: {
        publicKey
      }
    }
  }
}
