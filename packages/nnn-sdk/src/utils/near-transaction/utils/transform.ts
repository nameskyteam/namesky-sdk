import {ActionLike} from "../types/action";
import {
  NearApiJsActionLike,
  NearApiJsTransactionLike,
  NearWalletSelectorActionLike,
  NearWalletSelectorTransactionLike
} from "../types/transform";
import nearApiJs from "near-api-js";
import {PublicKey} from "near-api-js/lib/utils";
import {fullAccessKey, functionCallAccessKey} from "near-api-js/lib/transaction";
import {TransactionLike} from "../types/transaction";

export function parseNearApiJsAction(action: ActionLike): NearApiJsActionLike {
  const {type, params} = action

  if (type === 'CreateAccount') {
    return nearApiJs.transactions.createAccount()

  } else if (type === 'DeleteAccount') {
    const {beneficiaryId} = params
    return nearApiJs.transactions.deleteAccount(beneficiaryId)

  } else if (type === 'AddKey') {
    const {publicKey, accessKey} = params
    const {permission} = accessKey
    if (permission === 'FullAccess') {
      return nearApiJs.transactions.addKey(
        PublicKey.fromString(publicKey),
        fullAccessKey()
      )
    } else {
      const {receiverId, methodNames, allowance} = permission
      return nearApiJs.transactions.addKey(
        PublicKey.fromString(publicKey),
        functionCallAccessKey(receiverId, methodNames, allowance)
      )
    }

  } else if (type === 'DeleteKey') {
    const {publicKey} = params
    return nearApiJs.transactions.deleteKey(PublicKey.fromString(publicKey))

  } else if (type === 'DeployContract') {
    const {code} = params
    return nearApiJs.transactions.deployContract(code)

  } else if (type === 'Stake') {
    const {amount, publicKey} = params
    return nearApiJs.transactions.stake(amount, PublicKey.fromString(publicKey))

  } else if (type === 'FunctionCall') {
    const {methodName, args, gas, attachedDeposit} = params
    return nearApiJs.transactions.functionCall(methodName, args, gas, attachedDeposit)

  } else if (type === 'Transfer') {
    const {amount} = params
    return nearApiJs.transactions.transfer(amount)

  } else {
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

  if (type === 'CreateAccount') {
    return action

  } else if (type === 'DeleteAccount') {
    return action

  } else if (type === 'AddKey') {
    const {publicKey, accessKey, nonce} = params
    const {permission} = accessKey
    return {
      type,
      params: {
        publicKey,
        accessKey: {
          permission,
          nonce
        }
      }
    }

  } else if (type === 'DeleteKey') {
    return action

  } else if (type === 'DeployContract') {
    return action

  } else if (type === 'Stake') {
    const {amount, publicKey} = params
    return {
      type,
      params: {
        stake: amount,
        publicKey
      }
    }

  } else if (type === 'FunctionCall') {
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

  } else if (type === 'Transfer') {
    const {amount} = params
    return {
      type,
      params: {
        deposit: amount
      }
    }

  } else {
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
