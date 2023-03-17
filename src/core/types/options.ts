import {
  ArgsOptions,
  AttachedDepositOptions,
  BlockQuery,
  GasOptions,
  NftApproveArgs,
  NftRevokeArgs,
  NftTransferArgs,
} from 'multi-transaction';
import {
  AcceptOfferingArgs,
  BuyListingArgs,
  CreateListingArgs,
  CreateMarketAccountArgs,
  CreateOfferingArgs,
  GetAccountViewOfArgs,
  GetListingUniqueIdArgs,
  GetListingViewArgs,
  GetListingViewsArgs,
  GetListingViewsOfArgs,
  GetNftApprovalArgs,
  GetNftOfferingViewsOfArgs,
  getOfferingUniqueIdArgs,
  GetOfferingViewArgs,
  GetOfferingViewsArgs,
  GetOfferingViewsOfArgs,
  GetUserLastReadNotificationTimeArgs,
  GetUserLikesArgs,
  GetUserWatchListArgs,
  LikeArgs,
  NearDepositArgs,
  NearWithdrawArgs,
  NftIsRegisteredArgs,
  NftNameSkyTokenArgs,
  NftNameSkyTokensArgs,
  NftNameSkyTokensForOwnerArgs,
  NftRedeemArgs,
  NftRegisterArgs,
  NftRegistrantIdsOfArgs,
  NftStateArgs,
  NftSupplyForOwnerArgs,
  NftUnregisterArgs,
  ReadNotificationAtArgs,
  RemoveListingArgs,
  RemoveOfferingArgs,
  UnlikeArgs,
  UnwatchArgs,
  UpdateListingArgs,
  UpdateOfferingArgs,
  WatchArgs,
} from './args';

// ================================================ Call =======================================================
interface ChangeFunctionExtraOptions {
  callbackUrl?: string;
}

type RequiredArgsOptions<Args> = Required<ArgsOptions<Args>>;

// ---------------------------------------------- Controller ---------------------------------------------------
export interface SetupControllerOptions {
  registrantId: string;
  code: Buffer;
  gasForCleanState?: string;
  gasForInit?: string;
}

// ---------------------------------------------- Core ---------------------------------------------------------
export interface NftRegisterOptions extends RequiredArgsOptions<NftRegisterArgs>, AttachedDepositOptions, GasOptions {
  registrantId: string;
}

export interface NftUnregisterOptions
  extends RequiredArgsOptions<NftUnregisterArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface NftRedeemOptions extends RequiredArgsOptions<NftRedeemArgs>, GasOptions, ChangeFunctionExtraOptions {}

export interface NftTransferOptions
  extends RequiredArgsOptions<NftTransferArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface NftApproveOptions
  extends RequiredArgsOptions<NftApproveArgs>,
    AttachedDepositOptions,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface NftRevokeOptions extends RequiredArgsOptions<NftRevokeArgs>, GasOptions, ChangeFunctionExtraOptions {}

// ---------------------------------------------- Marketplace --------------------------------------------------
export interface CreateMarketAccountOption
  extends ArgsOptions<CreateMarketAccountArgs>,
    AttachedDepositOptions,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface NearDepositOptions
  extends ArgsOptions<NearDepositArgs>,
    AttachedDepositOptions,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface NearWithdrawOptions extends ArgsOptions<NearWithdrawArgs>, GasOptions, ChangeFunctionExtraOptions {}

export interface BuyListingOptions
  extends RequiredArgsOptions<BuyListingArgs>,
    AttachedDepositOptions,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface CreateListingOptions
  extends RequiredArgsOptions<CreateListingArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {
  listingStorageDeposit?: string;
  approvalStorageDeposit?: string;
}

export interface UpdateListingOptions
  extends RequiredArgsOptions<UpdateListingArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {
  approvalStorageDeposit?: string;
}

export interface RemoveListingOptions
  extends RequiredArgsOptions<RemoveListingArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface AcceptOfferingOptions
  extends RequiredArgsOptions<AcceptOfferingArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {
  approvalStorageDeposit?: string;
}

export interface CreateOfferingOptions
  extends RequiredArgsOptions<CreateOfferingArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {
  offeringStorageDeposit?: string;
}

export interface UpdateOfferingOptions
  extends RequiredArgsOptions<UpdateOfferingArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {}

export interface RemoveOfferingOptions
  extends RequiredArgsOptions<RemoveOfferingArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {}

// ---------------------------------------------- User Setting --------------------------------------------------
export interface LikeOptions extends RequiredArgsOptions<LikeArgs>, GasOptions, ChangeFunctionExtraOptions {}

export interface UnlikeOptions extends RequiredArgsOptions<UnlikeArgs>, GasOptions, ChangeFunctionExtraOptions {}

export interface WatchOptions extends RequiredArgsOptions<WatchArgs>, GasOptions, ChangeFunctionExtraOptions {}

export interface UnwatchOptions extends RequiredArgsOptions<UnwatchArgs>, GasOptions, ChangeFunctionExtraOptions {}

export interface ReadNotificationAtOptions
  extends ArgsOptions<ReadNotificationAtArgs>,
    GasOptions,
    ChangeFunctionExtraOptions {}

// ================================================ View =======================================================
interface ViewFunctionExtraOptions {
  blockQuery?: BlockQuery;
}

// ---------------------------------------------- Controller ---------------------------------------------------
export interface GetControllerOwnerIdOptions extends ViewFunctionExtraOptions {
  registrantId: string;
}

// ---------------------------------------------- Core ---------------------------------------------------------
export interface NftIsRegisteredOptions extends RequiredArgsOptions<NftIsRegisteredArgs>, ViewFunctionExtraOptions {}

export interface NftRegistrantIdsOfOptions
  extends RequiredArgsOptions<NftRegistrantIdsOfArgs>,
    ViewFunctionExtraOptions {}

export interface NftStateOptions extends RequiredArgsOptions<NftStateArgs>, ViewFunctionExtraOptions {}

export interface NftNameSkyTokenOptions extends RequiredArgsOptions<NftNameSkyTokenArgs>, ViewFunctionExtraOptions {}

export interface NftNameSkyTokensOptions extends ArgsOptions<NftNameSkyTokensArgs>, ViewFunctionExtraOptions {}

export interface NftNameSkyTokensForOwnerOptions
  extends RequiredArgsOptions<NftNameSkyTokensForOwnerArgs>,
    ViewFunctionExtraOptions {}

export interface NftTotalSupplyOptions extends ViewFunctionExtraOptions {}

export interface NftSupplyForOwnerOptions
  extends RequiredArgsOptions<NftSupplyForOwnerArgs>,
    ViewFunctionExtraOptions {}

export interface GetLatestControllerCodeOptions extends ViewFunctionExtraOptions {}

export interface GetLatestControllerCodeHashOptions extends ViewFunctionExtraOptions {}

export interface GetMintFeeOptions extends ViewFunctionExtraOptions {}

export interface GetRoyaltyOptions extends ViewFunctionExtraOptions {}

// ---------------------------------------------- Marketplace --------------------------------------------------
export interface GetAccountViewOfOptions extends RequiredArgsOptions<GetAccountViewOfArgs>, ViewFunctionExtraOptions {}

export interface GetOfferingViewOptions extends RequiredArgsOptions<GetOfferingViewArgs>, ViewFunctionExtraOptions {}

export interface GetOfferingViewsOptions extends ArgsOptions<GetOfferingViewsArgs>, ViewFunctionExtraOptions {}

export interface GetOfferingViewsOfOptions
  extends RequiredArgsOptions<GetOfferingViewsOfArgs>,
    ViewFunctionExtraOptions {}

export interface GetNftOfferingViewsOfOptions
  extends RequiredArgsOptions<GetNftOfferingViewsOfArgs>,
    ViewFunctionExtraOptions {}

export interface GetOfferingUniqueIdOptions
  extends RequiredArgsOptions<getOfferingUniqueIdArgs>,
    ViewFunctionExtraOptions {}

export interface GetListingViewOptions extends RequiredArgsOptions<GetListingViewArgs>, ViewFunctionExtraOptions {}

export interface GetListingViewsOptions extends ArgsOptions<GetListingViewsArgs>, ViewFunctionExtraOptions {}

export interface GetListingViewsOfOptions
  extends RequiredArgsOptions<GetListingViewsOfArgs>,
    ViewFunctionExtraOptions {}

export interface GetListingUniqueIdOptions
  extends RequiredArgsOptions<GetListingUniqueIdArgs>,
    ViewFunctionExtraOptions {}

export interface GetNftApprovalOptions extends RequiredArgsOptions<GetNftApprovalArgs>, ViewFunctionExtraOptions {}

export interface GetTradingFeeRateOptions extends ViewFunctionExtraOptions {}

// ---------------------------------------------- User Setting --------------------------------------------------
export interface GetUserLikesOptions extends RequiredArgsOptions<GetUserLikesArgs>, ViewFunctionExtraOptions {}

export interface GetUserWatchListOptions extends RequiredArgsOptions<GetUserWatchListArgs>, ViewFunctionExtraOptions {}

export interface GetUserLastReadNotificationTimeOptions
  extends RequiredArgsOptions<GetUserLastReadNotificationTimeArgs>,
    ViewFunctionExtraOptions {}
