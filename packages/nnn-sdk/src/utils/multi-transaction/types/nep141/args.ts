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
