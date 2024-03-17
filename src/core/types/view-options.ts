import {
  GetAccountViewOfArgs,
  GetListingUniqueIdArgs,
  GetListingViewArgs,
  GetListingViewsArgs,
  GetListingViewsOfArgs,
  GetMintNumArgs,
  GetNftApprovalArgs,
  GetNftOfferingViewsOfArgs,
  getOfferingUniqueIdArgs,
  GetOfferingViewArgs,
  GetOfferingViewsArgs,
  GetOfferingViewsOfArgs,
  GetRewardsForAccountArgs,
  GetSpaceshipArgs,
  GetSpaceshipEngineArgs,
  GetUserLastReadNotificationTimeArgs,
  GetUserLikesArgs,
  GetUserWatchListArgs,
  NftGetMinterIdArgs,
  NftNameSkyTokenArgs,
  NftNameSkyTokensArgs,
  NftNameSkyTokensForOwnerArgs,
  NftRegistrantIdsOfArgs,
  NftStateArgs,
} from './args';
import { BlockQuery, NftSupplyForOwnerArgs } from 'multi-transaction';

interface ViewFunctionExtraOptions {
  blockQuery?: BlockQuery;
}

// ---------------------------------------------- Controller ---------------------------------------------------

export interface GetControllerOwnerIdOptions extends ViewFunctionExtraOptions {
  accountId: string;
}

// ---------------------------------------------- Core ---------------------------------------------------------

export interface NftGetMinterIdOptions extends ViewFunctionExtraOptions {
  args: NftGetMinterIdArgs;
}

export interface NftRegistrantIdsOfOptions extends ViewFunctionExtraOptions {
  args: NftRegistrantIdsOfArgs;
}

export interface NftStateOptions extends ViewFunctionExtraOptions {
  args: NftStateArgs;
}

export interface NftNameSkyTokenOptions extends ViewFunctionExtraOptions {
  args: NftNameSkyTokenArgs;
}

export interface NftNameSkyTokensOptions extends ViewFunctionExtraOptions {
  args?: NftNameSkyTokensArgs;
}

export interface NftNameSkyTokensForOwnerOptions extends ViewFunctionExtraOptions {
  args: NftNameSkyTokensForOwnerArgs;
}

export interface NftTotalSupplyOptions extends ViewFunctionExtraOptions {}

export interface NftSupplyForOwnerOptions extends ViewFunctionExtraOptions {
  args: NftSupplyForOwnerArgs;
}

export interface GetLatestControllerCodeOptions extends ViewFunctionExtraOptions {}

export interface GetLatestControllerCodeHashOptions extends ViewFunctionExtraOptions {}

export interface GetControllerCodeViewsOptions extends ViewFunctionExtraOptions {}

export interface GetMintFeeOptions extends ViewFunctionExtraOptions {}

export interface GetRoyaltyOptions extends ViewFunctionExtraOptions {}

export interface GetMintNumOptions extends ViewFunctionExtraOptions {
  args: GetMintNumArgs;
}

// ---------------------------------------------- Marketplace --------------------------------------------------

export interface GetAccountViewOfOptions extends ViewFunctionExtraOptions {
  args: GetAccountViewOfArgs;
}

export interface GetOfferingViewOptions extends ViewFunctionExtraOptions {
  args: GetOfferingViewArgs;
}

export interface GetOfferingViewsOptions extends ViewFunctionExtraOptions {
  args?: GetOfferingViewsArgs;
}

export interface GetOfferingViewsOfOptions extends ViewFunctionExtraOptions {
  args: GetOfferingViewsOfArgs;
}

export interface GetNftOfferingViewsOfOptions extends ViewFunctionExtraOptions {
  args: GetNftOfferingViewsOfArgs;
}

export interface GetOfferingUniqueIdOptions extends ViewFunctionExtraOptions {
  args: getOfferingUniqueIdArgs;
}

export interface GetListingViewOptions extends ViewFunctionExtraOptions {
  args: GetListingViewArgs;
}

export interface GetListingViewsOptions extends ViewFunctionExtraOptions {
  args?: GetListingViewsArgs;
}

export interface GetListingViewsOfOptions extends ViewFunctionExtraOptions {
  args: GetListingViewsOfArgs;
}

export interface GetListingUniqueIdOptions extends ViewFunctionExtraOptions {
  args: GetListingUniqueIdArgs;
}

export interface GetNftApprovalOptions extends ViewFunctionExtraOptions {
  args: GetNftApprovalArgs;
}

export interface GetTradingFeeRateOptions extends ViewFunctionExtraOptions {}

// ---------------------------------------------- User Setting --------------------------------------------------

export interface GetUserLikesOptions extends ViewFunctionExtraOptions {
  args: GetUserLikesArgs;
}

export interface GetUserWatchListOptions extends ViewFunctionExtraOptions {
  args: GetUserWatchListArgs;
}

export interface GetUserLastReadNotificationTimeOptions extends ViewFunctionExtraOptions {
  args: GetUserLastReadNotificationTimeArgs;
}

// ---------------------------------------------- Spaceship -----------------------------------------------------

export interface GetSpaceshipEngineOptions extends ViewFunctionExtraOptions {
  args: GetSpaceshipEngineArgs;
}

export interface GetRewardsForAccountOptions extends ViewFunctionExtraOptions {
  args: GetRewardsForAccountArgs;
}

export interface GetTotalAddedFuelNumOptions extends ViewFunctionExtraOptions {}

export interface GetSpaceshipOptions extends ViewFunctionExtraOptions {
  args: GetSpaceshipArgs;
}
