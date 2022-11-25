import nearApiJs from "near-api-js";
import nearWalletSelector from "@near-wallet-selector/core";

export interface RequiredNearApiJsTransaction {
  receiverId: string,
  actions: NearApiJsActionRequired[]
}

export type NearApiJsActionRequired = nearApiJs.transactions.Action

export interface RequiredNearWalletSelectorTransaction {
  signerId?: string
  receiverId: string
  actions: NearWalletSelectorActionRequired[]
}

export type NearWalletSelectorActionRequired = nearWalletSelector.Action
