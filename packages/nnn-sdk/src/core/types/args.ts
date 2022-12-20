// ---------------------------------------------- Controller ---------------------------------------------------
export interface CleanStateArgs {
  keys: string[];
}

export interface InitArgs {
  owner_id: string;
}

// ------------------------------------------------ Nft --------------------------------------------------------
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

// ------------------------------------------------ Market -----------------------------------------------------
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
