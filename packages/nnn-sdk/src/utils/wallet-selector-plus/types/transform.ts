import nearApiJs from "near-api-js";
import nearWalletSelector from "@near-wallet-selector/core";

export type NearApiJsActionLike = nearApiJs.transactions.Action

export interface NearApiJsTransactionLike {
  receiverId: string,
  actions: NearApiJsActionLike[]
}

export type NearWalletSelectorActionLike = nearWalletSelector.Action

export interface NearWalletSelectorTransactionLike {
  signerId?: string
  receiverId: string
  actions: NearWalletSelectorActionLike[]
}
