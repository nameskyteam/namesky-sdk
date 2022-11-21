export interface NftRegisterArgs {
  minter_id: string
}

export interface CleanStateArgs {
  keys: string[]
}

export interface InitArgs {
  owner_id: string
}

export interface NftIsRegisteredArgs {
  registrant_id: string
}

export interface NftRedeemArgs {
  token_id: string,
  public_key: string,
  force?: boolean,
  memo?: string,
}
