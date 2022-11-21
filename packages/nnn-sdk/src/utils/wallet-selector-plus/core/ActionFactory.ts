import {
  AddKeyAction,
  CreateAccountAction,
  DeleteAccountAction,
  DeleteKeyAction,
  DeployContractAction,
  FunctionCallAction,
  StakeAction,
  TransferAction
} from "@near-wallet-selector/core";
import {
  AddKey,
  DeleteAccount,
  DeleteKey,
  DeployContract,
  FunctionCall,
  Stake,
  Transfer
} from "../types/action";
import {Gas} from "../utils/Gas";
import {Amount} from "../utils/Amount";
import {BaseArgs} from "../types/common";

export class ActionFactory {
  private constructor() {}

  static transfer({amount}: Transfer): TransferAction {
    return {
      type: "Transfer",
      params: {
        deposit: amount
      }
    }
  }

  static functionCall<Args extends BaseArgs>({
    methodName,
    args,
    gas,
    attachedDeposit
}: FunctionCall<Args>): FunctionCallAction {
    return {
      type: "FunctionCall",
      params: {
        methodName,
        args: args ?? {},
        gas: gas ?? Gas.DEFAULT,
        deposit: attachedDeposit ?? Amount.ZERO,
      }
    }
  }

  static deployContract({code}: DeployContract): DeployContractAction {
    return {
      type: "DeployContract",
      params: {
        code
      }
    }
  }

  static stake({amount, publicKey}: Stake): StakeAction {
    return {
      type: "Stake",
      params: {
          stake: amount,
          publicKey
      }
    }
  }

  static createAccount(): CreateAccountAction {
    return {
      type: "CreateAccount"
    }
  }

  static deleteAccount({beneficiaryId}: DeleteAccount): DeleteAccountAction {
    return {
      type: "DeleteAccount",
      params: {
        beneficiaryId
      }
    }
  }

  static addKey({publicKey, permission, nonce}: AddKey): AddKeyAction {
    return {
      type: "AddKey",
      params: {
        publicKey,
        accessKey: {
            nonce,
            permission
        }
      }
    }
  }

  static deleteKey({publicKey}: DeleteKey): DeleteKeyAction {
    return {
      type: "DeleteKey",
      params: {
        publicKey
      }
    }
  }
}
