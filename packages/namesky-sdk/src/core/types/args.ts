// ---------------------------------------------- Controller ---------------------------------------------------
export type CleanStateArgs = Uint8Array;

export type InitArgs = Uint8Array;

// ---------------------------------------------- Core ---------------------------------------------------------
export interface NftRegisterArgs {
  minter_id: string;
}

export interface NftIsRegisteredArgs {
  registrant_id: string;
}

export interface NftRedeemArgs {
  token_id: string;
  public_key: string;
  force?: boolean;
  memo?: string;
}

// ---------------------------------------------- Marketplace -----------------------------------------------------
export interface CreateMarketAccountArgs {
  account_id?: string;
  registration_only?: boolean;
}

export interface NearDepositArgs {
  account_id?: string;
}

export interface NearWithdrawArgs {
  amount?: string;
}

export interface CreateListingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
}

export interface UpdateListingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  new_price: string;
}

export interface RemoveListingArgs {
  nft_contract_id: string;
  nft_token_id: string;
}

export interface CreateOfferingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  is_simple_offering: boolean;
}

export interface UpdateOfferingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  new_price: string;
}

export interface RemoveOfferingArgs {
  nft_contract_id: string;
  nft_token_id: string;
}

export interface GetAccountViewOfArgs {
  account_id: string;
}

export interface GetOfferingViewArgs {
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
}

export interface GetOfferingViewsArgs {
  offset?: number;
  limit?: number;
}

export interface GetOfferingViewsOfArgs {
  account_id: string;
  offset?: number;
  limit?: number;
}

export interface GetNftOfferingViewsOfArgs {
  nft_contract_id: string;
  nft_token_id: string;
  offset?: number;
  limit?: number;
}

export interface getOfferingUniqueIdArgs {
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
}

export interface GetListingViewArgs {
  nft_contract_id: string;
  nft_token_id: string;
}

export interface GetListingViewsArgs {
  offset?: number;
  limit?: number;
}

export interface GetListingViewsOfArgs {
  account_id: string;
  offset?: number;
  limit?: number;
}

export interface GetListingUniqueIdArgs {
  nft_contract_id: string;
  nft_token_id: string;
}

export interface GetNftApprovalArgs {
  nft_contract_id: string;
  nft_token_id: string;
}
