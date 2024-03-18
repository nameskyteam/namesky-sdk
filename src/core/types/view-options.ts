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

type ViewFunctionExtraOptions = {
  blockQuery?: BlockQuery;
};

// ---------------------------------------------- Controller ---------------------------------------------------

export type GetControllerOwnerIdOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

// ---------------------------------------------- Core ---------------------------------------------------------

export type NftGetMinterIdOptions = ViewFunctionExtraOptions & {
  args: NftGetMinterIdArgs;
};

export type NftRegistrantIdsOfOptions = ViewFunctionExtraOptions & {
  args: NftRegistrantIdsOfArgs;
};

export type NftStateOptions = ViewFunctionExtraOptions & {
  args: NftStateArgs;
};

export type NftNameSkyTokenOptions = ViewFunctionExtraOptions & {
  args: NftNameSkyTokenArgs;
};

export type NftNameSkyTokensOptions = ViewFunctionExtraOptions & {
  args?: NftNameSkyTokensArgs;
};

export type NftNameSkyTokensForOwnerOptions = ViewFunctionExtraOptions & {
  args: NftNameSkyTokensForOwnerArgs;
};

export type NftTotalSupplyOptions = ViewFunctionExtraOptions & {};

export type NftSupplyForOwnerOptions = ViewFunctionExtraOptions & {
  args: NftSupplyForOwnerArgs;
};

export type GetLatestControllerCodeOptions = ViewFunctionExtraOptions & {};

export type GetLatestControllerCodeHashOptions = ViewFunctionExtraOptions & {};

export type GetControllerCodeViewsOptions = ViewFunctionExtraOptions & {};

export type GetMintFeeOptions = ViewFunctionExtraOptions & {};

export type GetRoyaltyOptions = ViewFunctionExtraOptions & {};

export type GetMintNumOptions = ViewFunctionExtraOptions & {
  args: GetMintNumArgs;
};

// ---------------------------------------------- Marketplace --------------------------------------------------

export type GetAccountViewOfOptions = ViewFunctionExtraOptions & {
  args: GetAccountViewOfArgs;
};

export type GetOfferingViewOptions = ViewFunctionExtraOptions & {
  args: GetOfferingViewArgs;
};

export type GetOfferingViewsOptions = ViewFunctionExtraOptions & {
  args?: GetOfferingViewsArgs;
};

export type GetOfferingViewsOfOptions = ViewFunctionExtraOptions & {
  args: GetOfferingViewsOfArgs;
};

export type GetNftOfferingViewsOfOptions = ViewFunctionExtraOptions & {
  args: GetNftOfferingViewsOfArgs;
};

export type GetOfferingUniqueIdOptions = ViewFunctionExtraOptions & {
  args: getOfferingUniqueIdArgs;
};

export type GetListingViewOptions = ViewFunctionExtraOptions & {
  args: GetListingViewArgs;
};

export type GetListingViewsOptions = ViewFunctionExtraOptions & {
  args?: GetListingViewsArgs;
};

export type GetListingViewsOfOptions = ViewFunctionExtraOptions & {
  args: GetListingViewsOfArgs;
};

export type GetListingUniqueIdOptions = ViewFunctionExtraOptions & {
  args: GetListingUniqueIdArgs;
};

export type GetNftApprovalOptions = ViewFunctionExtraOptions & {
  args: GetNftApprovalArgs;
};

export type GetTradingFeeRateOptions = ViewFunctionExtraOptions & {};

// ---------------------------------------------- User Setting --------------------------------------------------

export type GetUserLikesOptions = ViewFunctionExtraOptions & {
  args: GetUserLikesArgs;
};

export type GetUserWatchListOptions = ViewFunctionExtraOptions & {
  args: GetUserWatchListArgs;
};

export type GetUserLastReadNotificationTimeOptions = ViewFunctionExtraOptions & {
  args: GetUserLastReadNotificationTimeArgs;
};

// ---------------------------------------------- Spaceship -----------------------------------------------------

export type GetSpaceshipEngineOptions = ViewFunctionExtraOptions & {
  args: GetSpaceshipEngineArgs;
};

export type GetRewardsForAccountOptions = ViewFunctionExtraOptions & {
  args: GetRewardsForAccountArgs;
};

export type GetTotalAddedFuelNumOptions = ViewFunctionExtraOptions & {};

export type GetSpaceshipOptions = ViewFunctionExtraOptions & {
  args: GetSpaceshipArgs;
};
