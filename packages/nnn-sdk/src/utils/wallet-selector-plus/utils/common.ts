import {FinalExecutionOutcome, FinalExecutionStatus} from "near-api-js/lib/providers";
import {WalletModule} from "../types/wallet";
import {Action, Network, NetworkId, WalletModuleFactory} from "@near-wallet-selector/core";
import {setupNearWallet} from "@near-wallet-selector/near-wallet";
import {setupMyNearWallet} from "@near-wallet-selector/my-near-wallet";
import {setupSender} from "@near-wallet-selector/sender";
import {transactions} from "near-api-js";
import {PublicKey} from "near-api-js/lib/utils";
import {fullAccessKey, functionCallAccessKey} from "near-api-js/lib/transaction";

export function parseOutcomeValue<Value> (outcome: FinalExecutionOutcome): Value {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue
  if (successValue) {
    const decodedValue: string = Buffer.from(successValue, 'base64').toString()
    return JSON.parse(decodedValue)
  } else {
    return void 0 as Value
  }
}

export function setupWalletModules(modules: WalletModule[]) {
  return modules.map(({type, config}): WalletModuleFactory => {
    switch (type) {
      case 'NearWallet':
        return setupNearWallet(config)
      case 'MyNearWallet':
        return setupMyNearWallet(config)
      case 'Sender':
        return setupSender(config)
      default:
        throw Error(`Wrong wallet type: ${type}`)
    }
  })
}

export const getNetworkPreset = (networkId: NetworkId): Network => {
  switch (networkId) {
    case "mainnet":
      return {
        networkId,
        nodeUrl: "https://rpc.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.near.org",
        indexerUrl: "https://api.kitwallet.app",
      };
    case "testnet":
      return {
        networkId,
        nodeUrl: "https://rpc.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        indexerUrl: "https://testnet-api.kitwallet.app",
      };
    default:
      throw Error(`Failed to find config for: '${networkId}'`);
  }
};

export const resolveNetwork = (network: NetworkId | Network): Network => {
  return typeof network === "string" ? getNetworkPreset(network) : network;
};

export function transformAction(action: Action): transactions.Action {
  const actionType = action.type
  if (actionType === 'Transfer') {
    const params = action.params
    return transactions.transfer(params.deposit)
  } else if (actionType === 'FunctionCall') {
    const params = action.params
    const {methodName, args, gas, deposit} = params
    return transactions.functionCall(methodName, args, gas, deposit)
  } else if (actionType === 'DeployContract') {
    const params = action.params
    const {code} = params
    return transactions.deployContract(code)
  } else if (actionType === 'Stake') {
    const params = action.params
    const {stake, publicKey} = params
    return transactions.stake(stake, PublicKey.fromString(publicKey))
  } else if (actionType === 'AddKey') {
    const params = action.params
    const {publicKey, accessKey} = params
    const {permission} = accessKey
    if (permission === 'FullAccess') {
      return transactions.addKey(PublicKey.fromString(publicKey), fullAccessKey())
    } else {
      const {receiverId, allowance, methodNames} = permission
      return transactions.addKey(PublicKey.fromString(publicKey), functionCallAccessKey(receiverId, methodNames ?? [], allowance))
    }
  } else if (actionType === 'DeleteKey') {
    const {params} = action
    const {publicKey} = params
    return transactions.deleteKey(PublicKey.fromString(publicKey))
  } else if (actionType === 'CreateAccount') {
    return transactions.createAccount()
  } else if (actionType === 'DeleteAccount') {
    const {params} = action
    const {beneficiaryId} = params
    return transactions.deleteAccount(beneficiaryId)
  } else {
    throw Error(`Error action type: ${actionType}`)
  }
}
