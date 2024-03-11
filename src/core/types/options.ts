import { BlockQuery, NftApproveArgs, NftRevokeArgs, NftSupplyForOwnerArgs, NftTransferArgs } from 'multi-transaction';
import {
  AcceptOfferingArgs,
  AddFuelArgs,
  BuyListingArgs,
  CreateListingArgs,
  CreateMarketAccountArgs,
  CreateOfferingArgs,
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
  LikeArgs,
  NearDepositArgs,
  NearWithdrawArgs,
  NftGetMinterIdArgs,
  NftNameSkyTokenArgs,
  NftNameSkyTokensArgs,
  NftNameSkyTokensForOwnerArgs,
  NftRedeemArgs,
  NftRegistrantIdsOfArgs,
  NftStateArgs,
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

// ---------------------------------------------- Registrant ---------------------------------------------------
export interface NftRegisterOptions {
  registrantId: string;
  minterId: string;
  gas?: string;
}

export interface SetupControllerOptions {
  registrantId: string;
  gasForCleanState?: string;
  gasForInit?: string;
}

// ---------------------------------------------- Core ---------------------------------------------------------
export interface NftUnregisterOptions extends ChangeFunctionExtraOptions {
  args: NftUnregisterArgs;
  gas?: string;
}

export interface NftRedeemOptions extends ChangeFunctionExtraOptions {
  args: NftRedeemArgs;
  gas?: string;
}

export interface NftTransferOptions extends ChangeFunctionExtraOptions {
  args: NftTransferArgs;
  gas?: string;
}

export interface NftApproveOptions extends ChangeFunctionExtraOptions {
  args: NftApproveArgs;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface NftRevokeOptions extends ChangeFunctionExtraOptions {
  args: NftRevokeArgs;
  gas?: string;
}

// ---------------------------------------------- Marketplace --------------------------------------------------
export interface CreateMarketAccountOption extends ChangeFunctionExtraOptions {
  args?: CreateMarketAccountArgs;
  marketStorageDeposit?: string;
  gas?: string;
}

export interface NearDepositOptions extends ChangeFunctionExtraOptions {
  args?: NearDepositArgs;
  attachedDeposit: string;
  gas?: string;
}

export interface NearWithdrawOptions extends ChangeFunctionExtraOptions {
  args?: NearWithdrawArgs;
  gas?: string;
}

export interface BuyListingOptions extends ChangeFunctionExtraOptions {
  args: BuyListingArgs;
  attachedDeposit: string;
  gas?: string;
}

export interface CreateListingOptions extends ChangeFunctionExtraOptions {
  args: CreateListingArgs;
  listingStorageDeposit?: string;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface UpdateListingOptions extends ChangeFunctionExtraOptions {
  args: UpdateListingArgs;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface RemoveListingOptions extends ChangeFunctionExtraOptions {
  args: RemoveListingArgs;
  gas?: string;
}

export interface AcceptOfferingOptions extends ChangeFunctionExtraOptions {
  args: AcceptOfferingArgs;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface CreateOfferingOptions extends ChangeFunctionExtraOptions {
  args: CreateOfferingArgs;
  offeringStorageDeposit?: string;
  gas?: string;
}

export interface UpdateOfferingOptions extends ChangeFunctionExtraOptions {
  args: UpdateOfferingArgs;
  gas?: string;
}

export interface RemoveOfferingOptions extends ChangeFunctionExtraOptions {
  args: RemoveOfferingArgs;
  gas?: string;
}

// ---------------------------------------------- User Setting --------------------------------------------------
export interface LikeOptions extends ChangeFunctionExtraOptions {
  args: LikeArgs;
  gas?: string;
}

export interface UnlikeOptions extends ChangeFunctionExtraOptions {
  args: UnlikeArgs;
  gas?: string;
}

export interface WatchOptions extends ChangeFunctionExtraOptions {
  args: WatchArgs;
  gas?: string;
}

export interface UnwatchOptions extends ChangeFunctionExtraOptions {
  args: UnwatchArgs;
  gas?: string;
}

export interface ReadNotificationAtOptions extends ChangeFunctionExtraOptions {
  args?: ReadNotificationAtArgs;
  gas?: string;
}

// ---------------------------------------------- Spaceship -----------------------------------------------------
export interface MintSpaceshipOptions extends ChangeFunctionExtraOptions {
  spaceshipStorageDeposit?: string;
  gas?: string;
}

export interface AddFuelOptions extends ChangeFunctionExtraOptions {
  args: AddFuelArgs;
  gas?: string;
}

export interface DistributeAndClaimRewardsOptions extends ChangeFunctionExtraOptions {
  gasForDistribute?: string;
  gasForClaim?: string;
}

// ================================================ View =======================================================
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
