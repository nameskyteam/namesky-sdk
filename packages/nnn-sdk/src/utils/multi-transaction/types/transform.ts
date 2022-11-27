import * as nearApiJs from "near-api-js";
import * as nearWalletSelector from "@near-wallet-selector/core";

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
