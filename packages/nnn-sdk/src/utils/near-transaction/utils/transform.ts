import {AccessKeyPermission, ActionLike} from "../types/action";
import {
  NearApiJsActionLike,
  NearApiJsTransactionLike,
  NearWalletSelectorActionLike,
  NearWalletSelectorTransactionLike
} from "../types/transform";
import nearApiJs from "near-api-js";
import {PublicKey} from "near-api-js/lib/utils";
import {AccessKey} from "near-api-js/lib/transaction";
import {TransactionLike} from "../types/transaction";

export function parseNearApiJsAction(action: ActionLike): NearApiJsActionLike {
  const {type, params} = action
  switch (type) {
    case "CreateAccount": {
      return nearApiJs.transactions.createAccount()
    }
    case "DeleteAccount": {
      const {beneficiaryId} = params
      return nearApiJs.transactions.deleteAccount(beneficiaryId)
    }
    case "AddKey": {
      const {publicKey, accessKey} = params
      return nearApiJs.transactions.addKey(
        PublicKey.fromString(publicKey),
        getAccessKey(accessKey.permission)
      )
    }
    case "DeleteKey": {
      const {publicKey} = params
      return nearApiJs.transactions.deleteKey(PublicKey.fromString(publicKey))
    }
    case "DeployContract": {
      const {code} = params
      return nearApiJs.transactions.deployContract(code)
    }
    case "Stake": {
      const {amount, publicKey} = params
      return nearApiJs.transactions.stake(amount, PublicKey.fromString(publicKey))
    }
    case "FunctionCall": {
      const {methodName, args, gas, attachedDeposit} = params
      return nearApiJs.transactions.functionCall(methodName, args, gas, attachedDeposit)
    }
    case "Transfer": {
      const {amount} = params
      return nearApiJs.transactions.transfer(amount)
    }
    default:
      throw Error(`Error action type: ${type}`)
  }
}

export function parseNearApiJsTransaction({receiverId, actions}: TransactionLike): NearApiJsTransactionLike {
  return {
    receiverId,
    actions: actions.map(action => parseNearApiJsAction(action))
  }
}

export function parseNearWalletSelectorAction(action: ActionLike): NearWalletSelectorActionLike {
  const {type, params} = action
  switch (type) {
    case "CreateAccount": {
      return action
    }
    case "DeleteAccount": {
      return action
    }
    case "AddKey": {
      const {publicKey, accessKey, nonce} = params
      return {
        type,
        params: {
          publicKey,
          accessKey: {
            permission: accessKey.permission,
            nonce
          }
        }
      }
    }
    case "DeleteKey": {
      return action
    }
    case "DeployContract": {
      return action
    }
    case "Stake": {
      const {amount, publicKey} = params
      return {
        type,
        params: {
          stake: amount,
          publicKey
        }
      }
    }
    case "FunctionCall": {
      const {methodName, args, gas, attachedDeposit} = params
      return {
        type,
        params: {
          methodName,
          args,
          gas,
          deposit: attachedDeposit
        }
      }
    }
    case "Transfer": {
      const {amount} = params
      return {
        type,
        params: {
          deposit: amount
        }
      }
    }
    default:
      throw Error(`Error action type: ${type}`)
  }
}

export function parseNearWalletSelectorTransaction({signerId, receiverId, actions}: TransactionLike): NearWalletSelectorTransactionLike {
  return {
    signerId,
    receiverId,
    actions: actions.map(action => parseNearWalletSelectorAction(action))
  }
}

function getAccessKey(permission: AccessKeyPermission): AccessKey {
  if (permission === "FullAccess") {
    return nearApiJs.transactions.fullAccessKey();
  } else {
    const { receiverId, methodNames, allowance } = permission;
    return nearApiJs.transactions.functionCallAccessKey(receiverId, methodNames, allowance);
  }
}
