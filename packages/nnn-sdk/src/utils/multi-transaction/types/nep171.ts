import {SpecificFunctionCallOptions} from "./common";

export interface NftTransferArgs {
  receiver_id: string,
  token_id: string,
  approval_id?: number,
  memo?: string,
}

export interface NftTransferCallArgs extends NftTransferArgs {
  msg: string
}

export interface NftTokenArgs {
  token_id: string
}

export interface Token {
  token_id: string,
  owner_id: string,
  metadata?: TokenMetadata,
  approved_account_ids?: Record<string, number>,
}

export interface TokenMetadata {
  title?: string, // ex. "Arch Nemesis: Mail Carrier" or "Parcel #5055"
  description?: string, // free-form description
  media?: string, // URL to associated media, preferably to decentralized, content-addressed storage
  media_hash?: string, // Base64-encoded sha256 hash of content referenced by the `media` field. Required if `media` is included.
  copies?: number, // number of copies of this set of metadata in existence when token was minted.
  issued_at?: string, // ISO 8601 datetime when token was issued or minted
  expires_at?: string, // ISO 8601 datetime when token expires
  starts_at?: string, // ISO 8601 datetime when token starts being valid
  updated_at?: string, // ISO 8601 datetime when token was last updated
  extra?: string, // anything extra the NFT wants to store on-chain. Can be stringified JSON.
  reference?: string, // URL to an off-chain JSON file with more info.
  reference_hash?: string, // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
}

export interface NftApproveArgs {
  token_id: string,
  account_id: string,
  msg?: string,
}

export interface NftRevokeArgs {
  token_id: string,
  account_id: string
}

export interface NftRevokeAllArgs {
  token_id: string
}

export interface NftIsApprovedArgs {
  token_id: string,
  approved_account_id: string,
  approval_id?: number,
}

export type NftTransferOptions = Omit<SpecificFunctionCallOptions<NftTransferArgs>, 'attachedDeposit'>

export type NftTransferCallOptions = Omit<SpecificFunctionCallOptions<NftTransferCallArgs>, 'attachedDeposit'>

export type NftApproveOptions = Omit<SpecificFunctionCallOptions<NftApproveArgs>, ''>

export type NftRevokeOptions = Omit<SpecificFunctionCallOptions<NftRevokeArgs>, 'attachedDeposit'>

export type NftRevokeAllOptions = Omit<SpecificFunctionCallOptions<NftRevokeAllArgs>, 'attachedDeposit'>
