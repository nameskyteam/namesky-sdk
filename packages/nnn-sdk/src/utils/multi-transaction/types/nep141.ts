import {SpecificFunctionCallOptions} from "./common";

export interface FtTransferArgs {
  receiver_id: string
  amount: string
  memo?: string
}

export interface FtTransferCallArgs extends FtTransferArgs {
  msg: string
}

export interface FtBalanceOfArgs {
  account_id: string
}

export interface FtTotalSupplyArgs {}

export type FtTransferOptions = Omit<SpecificFunctionCallOptions<FtTransferArgs>, 'attachedDeposit'>

export type FtTransferCallOptions = Omit<SpecificFunctionCallOptions<FtTransferCallArgs>, 'attachedDeposit'>
