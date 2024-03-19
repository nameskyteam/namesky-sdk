import { BlockQuery } from 'multi-transaction';

type ViewFunctionExtraOptions = {
  blockQuery?: BlockQuery;
};

// ---------------------------------------------- Controller ---------------------------------------------------

export type GetControllerOwnerIdOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type GetNftAccountSafetyOptions = ViewFunctionExtraOptions & {
  accountId: string;
  strict?: boolean;
};

// ---------------------------------------------- Core ---------------------------------------------------------

export type NftGetMinterIdOptions = ViewFunctionExtraOptions & {
  registrantId: string;
};

export type NftRegistrantIdsOfOptions = ViewFunctionExtraOptions & {
  minterId: string;
  fromIndex?: string;
  limit?: number;
};

export type NftRegistrantIdsOptions = ViewFunctionExtraOptions & {
  fromIndex?: string;
  limit?: number;
};

export type NftStateOptions = ViewFunctionExtraOptions & {
  tokenId: string;
};

export type NftNameSkyTokenOptions = ViewFunctionExtraOptions & {
  tokenId: string;
};

export type NftNameSkyTokensOptions = ViewFunctionExtraOptions & {
  fromIndex?: string;
  limit?: number;
};

export type NftNameSkyTokensForOwnerOptions = ViewFunctionExtraOptions & {
  accountId: string;
  fromIndex?: string;
  limit?: number;
};

export type NftSupplyForOwnerOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type NftTotalSupplyOptions = ViewFunctionExtraOptions & {};

export type GetLatestControllerCodeOptions = ViewFunctionExtraOptions & {};

export type GetLatestControllerCodeHashOptions = ViewFunctionExtraOptions & {};

export type GetControllerCodeViewsOptions = ViewFunctionExtraOptions & {};

export type GetMintFeeOptions = ViewFunctionExtraOptions & {};

export type GetRoyaltyOptions = ViewFunctionExtraOptions & {};

export type GetMintNumOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

// ---------------------------------------------- Marketplace --------------------------------------------------

export type GetAccountViewOfOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type GetOfferingViewOptions = ViewFunctionExtraOptions & {
  tokenId: string;
  buyerId: string;
};

export type GetOfferingViewsOptions = ViewFunctionExtraOptions & {
  offset?: number;
  limit?: number;
};

export type GetOfferingViewsOfOptions = ViewFunctionExtraOptions & {
  accountId: string;
  offset?: number;
  limit?: number;
};

export type GetNftOfferingViewsOfOptions = ViewFunctionExtraOptions & {
  tokenId: string;
  offset?: number;
  limit?: number;
};

export type GetOfferingUniqueIdOptions = ViewFunctionExtraOptions & {
  tokenId: string;
  buyerId: string;
};

export type GetListingViewOptions = ViewFunctionExtraOptions & {
  tokenId: string;
};

export type GetListingViewsOptions = ViewFunctionExtraOptions & {
  offset?: number;
  limit?: number;
};

export type GetListingViewsOfOptions = ViewFunctionExtraOptions & {
  accountId: string;
  offset?: number;
  limit?: number;
};

export type GetListingUniqueIdOptions = ViewFunctionExtraOptions & {
  tokenId: string;
};

export type GetNftApprovalOptions = ViewFunctionExtraOptions & {
  tokenId: string;
};

export type GetTradingFeeRateOptions = ViewFunctionExtraOptions & {};

// ---------------------------------------------- User Setting --------------------------------------------------

export type GetUserLikesOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type GetUserWatchListOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type GetUserLastReadNotificationTimeOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

// ---------------------------------------------- Spaceship -----------------------------------------------------

export type GetSpaceshipOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type GetSpaceshipEngineOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type GetRewardTokenIdOptions = ViewFunctionExtraOptions & {};

export type GetRewardsForAccountOptions = ViewFunctionExtraOptions & {
  accountId: string;
};

export type GetTotalAddedFuelNumOptions = ViewFunctionExtraOptions & {};
