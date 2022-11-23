import nearApiJs from "near-api-js";
import nearWalletSelector from "@near-wallet-selector/core";

export interface Transform {
  parseNearApiJsTransactions(): NearApiJsTransactionLike[]
  parseNearWalletSelectorTransactions(): NearWalletSelectorTransactionLike[]
}

export interface NearApiJsTransactionLike {
  receiverId: string,
  actions: NearApiJsActionLike[]
}

export type NearApiJsActionLike = nearApiJs.transactions.Action

export interface NearWalletSelectorTransactionLike {
  signerId?: string
  receiverId: string
  actions: NearWalletSelectorActionLike[]
}

export type NearWalletSelectorActionLike = nearWalletSelector.Action
