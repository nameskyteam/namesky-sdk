export type UpdateWrapper<T> =
  | {
      UpdateSome: T;
    }
  | 'UpdateNone';

export type NonFungibleTokenReceiverMsg =
  | {
      CreateListing: {
        price: string;
        expire_time?: number;
      };
    }
  | {
      UpdateListing: {
        new_price?: string;
        new_expire_time?: UpdateWrapper<number>;
      };
    };

// ---------------------------------------------- Controller ---------------------------------------------------

export type CleanStateArgs = Uint8Array[];

export type InitArgs = Uint8Array;

// ---------------------------------------------- Core ---------------------------------------------------------

export type NftRegisterArgs = {
  minter_id: string;
};

export type NftUnregisterArgs = {
  registrant_id: string;
  public_key: string;
  force?: boolean;
};

export type NftGetMinterIdArgs = {
  registrant_id: string;
};

export type NftRegistrantIdsOfArgs = {
  minter_id: string;
  from_index?: string;
  limit?: number;
};

export type NftRegistrantIdsArgs = {
  from_index?: string;
  limit?: number;
};

export type NftStateArgs = {
  token_id: string;
};

export type NftNameSkyTokenArgs = {
  token_id: string;
};

export type NftNameSkyTokensArgs = {
  from_index?: string;
  limit?: number;
};

export type NftNameSkyTokensForOwnerArgs = {
  account_id: string;
  from_index?: string;
  limit?: number;
};

export type NftRedeemArgs = {
  token_id: string;
  public_key: string;
  force?: boolean;
  memo?: string;
};

export type GetMintNumArgs = {
  account_id: string;
};

// ---------------------------------------------- Marketplace -----------------------------------------------------

export type NearWithdrawArgs = {
  amount?: string;
};

export type BuyListingArgs = {
  nft_contract_id: string;
  nft_token_id: string;
};

export type RemoveListingArgs = {
  nft_contract_id: string;
  nft_token_id: string;
};

export type AcceptOfferingArgs = {
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
};

export type CreateOfferingArgs = {
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  is_simple_offering?: boolean;
  expire_time?: number;
};

export type UpdateOfferingArgs = {
  nft_contract_id: string;
  nft_token_id: string;
  new_price?: string;
  new_expire_time?: UpdateWrapper<number>;
};

export type RemoveOfferingArgs = {
  nft_contract_id: string;
  nft_token_id: string;
};

export type GetAccountViewOfArgs = {
  account_id: string;
};

export type GetOfferingViewArgs = {
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
};

export type GetOfferingViewsArgs = {
  offset?: number;
  limit?: number;
};

export type GetOfferingViewsOfArgs = {
  account_id: string;
  offset?: number;
  limit?: number;
};

export type GetNftOfferingViewsOfArgs = {
  nft_contract_id: string;
  nft_token_id: string;
  offset?: number;
  limit?: number;
};

export type GetOfferingUniqueIdArgs = {
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
};

export type GetListingViewArgs = {
  nft_contract_id: string;
  nft_token_id: string;
};

export type GetListingViewsArgs = {
  offset?: number;
  limit?: number;
};

export type GetListingViewsOfArgs = {
  account_id: string;
  offset?: number;
  limit?: number;
};

export type GetListingUniqueIdArgs = {
  nft_contract_id: string;
  nft_token_id: string;
};

export type GetNftApprovalArgs = {
  nft_contract_id: string;
  nft_token_id: string;
};

// ---------------------------------------------- User Setting --------------------------------------------------

export type LikeArgs = {
  token_id: string;
};

export type UnlikeArgs = {
  token_id: string;
};

export type WatchArgs = {
  token_id: string;
};

export type UnwatchArgs = {
  token_id: string;
};

export type ReadNotificationAtArgs = {
  timestamp?: string;
};

export type GetUserLikesArgs = {
  account_id: string;
};

export type GetUserWatchListArgs = {
  account_id: string;
};

export type GetUserLastReadNotificationTimeArgs = {
  account_id: string;
};

// ---------------------------------------------- Spaceship -----------------------------------------------------

export type GetSpaceshipArgs = {
  account_id: string;
};

export type GetSpaceshipEngineArgs = {
  account_id: string;
};

export type GetRewardsForAccountArgs = {
  account_id: string;
};

export type AddFuelArgs = {
  quantity: string;
};

export type DistributeRewardsArgs = {
  account_id: string;
};
