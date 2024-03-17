import { NftTokenArgs, NftTokensArgs, NftTokensForOwnerArgs } from 'multi-transaction';
import { UpdateWrapper } from './common';

// ---------------------------------------------- Controller ---------------------------------------------------

export type CleanStateArgs = Uint8Array[];

export type InitArgs = Uint8Array;

// ---------------------------------------------- Core ---------------------------------------------------------

export interface NftUnregisterArgs {
  registrant_id: string;
  public_key: string;
  force?: boolean;
}

export interface NftGetMinterIdArgs {
  registrant_id: string;
}

export interface NftRegistrantIdsOfArgs {
  minter_id: string;
  from_index?: string;
  limit?: number;
}

export interface NftStateArgs {
  token_id: string;
}

export type NftNameSkyTokenArgs = NftTokenArgs;

export type NftNameSkyTokensArgs = NftTokensArgs;

export type NftNameSkyTokensForOwnerArgs = NftTokensForOwnerArgs;

export interface NftRedeemArgs {
  token_id: string;
  public_key: string;
  force?: boolean;
  memo?: string;
}

export interface GetMintNumArgs {
  account_id: string;
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

export interface BuyListingArgs {
  nft_contract_id: string;
  nft_token_id: string;
}

export interface CreateListingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  expire_time?: number;
}

export interface UpdateListingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  new_price?: string;
  new_expire_time?: UpdateWrapper<number>;
}

export interface RemoveListingArgs {
  nft_contract_id: string;
  nft_token_id: string;
}

export interface AcceptOfferingArgs {
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
}

export interface CreateOfferingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  is_simple_offering?: boolean;
  expire_time?: number;
}

export interface UpdateOfferingArgs {
  nft_contract_id: string;
  nft_token_id: string;
  new_price?: string;
  new_expire_time?: UpdateWrapper<number>;
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

// ---------------------------------------------- User Setting --------------------------------------------------

export interface LikeArgs {
  token_id: string;
}

export interface UnlikeArgs {
  token_id: string;
}

export interface WatchArgs {
  token_id: string;
}

export interface UnwatchArgs {
  token_id: string;
}

export interface ReadNotificationAtArgs {
  timestamp?: string;
}

export interface GetUserLikesArgs {
  account_id: string;
}

export interface GetUserWatchListArgs {
  account_id: string;
}

export interface GetUserLastReadNotificationTimeArgs {
  account_id: string;
}

// ---------------------------------------------- Spaceship -----------------------------------------------------

export interface GetSpaceshipEngineArgs {
  account_id: string;
}

export interface GetRewardsForAccountArgs {
  account_id: string;
}

export interface AddFuelArgs {
  quantity: string;
}

export interface GetSpaceshipArgs {
  account_id: string;
}
