import {
  ArgsOptions,
  AttachedDepositOptions,
  BlockQuery,
  GasOptions,
  MethodArgs,
  NftApproveArgs,
  NftRevokeArgs,
  NftTransferArgs,
} from '../../utils';
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
  RemoveListingArgs,
  RemoveOfferingArgs,
  UpdateListingArgs,
  UpdateOfferingArgs,
} from './args';

// ================================================ Call =======================================================
interface FunctionCallExtraOptions {
  callbackUrl?: string;
}

type RequiredArgsOptions<Args extends MethodArgs> = Required<ArgsOptions<Args>>;

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
    FunctionCallExtraOptions {}

export interface NftRedeemOptions extends RequiredArgsOptions<NftRedeemArgs>, GasOptions, FunctionCallExtraOptions {}

export interface NftTransferOptions
  extends RequiredArgsOptions<NftTransferArgs>,
    GasOptions,
    FunctionCallExtraOptions {}

export interface NftApproveOptions
  extends RequiredArgsOptions<NftApproveArgs>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {}

export interface NftRevokeOptions extends RequiredArgsOptions<NftRevokeArgs>, GasOptions, FunctionCallExtraOptions {}

// ---------------------------------------------- Marketplace --------------------------------------------------
export interface CreateMarketAccountOption
  extends ArgsOptions<CreateMarketAccountArgs>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {}

export interface NearDepositOptions
  extends ArgsOptions<NearDepositArgs>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {}

export interface NearWithdrawOptions extends ArgsOptions<NearWithdrawArgs>, GasOptions, FunctionCallExtraOptions {}

export interface BuyListingOptions
  extends RequiredArgsOptions<BuyListingArgs>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {}

export interface CreateListingOptions
  extends RequiredArgsOptions<CreateListingArgs>,
    GasOptions,
    FunctionCallExtraOptions {
  listingStorageDeposit?: string;
  approvalStorageDeposit?: string;
}

export interface UpdateListingOptions
  extends RequiredArgsOptions<UpdateListingArgs>,
    GasOptions,
    FunctionCallExtraOptions {
  approvalStorageDeposit?: string;
}

export interface RemoveListingOptions
  extends RequiredArgsOptions<RemoveListingArgs>,
    GasOptions,
    FunctionCallExtraOptions {}

export interface AcceptOfferingOptions
  extends RequiredArgsOptions<AcceptOfferingArgs>,
    GasOptions,
    FunctionCallExtraOptions {
  approvalStorageDeposit?: string;
}

export interface CreateOfferingOptions
  extends RequiredArgsOptions<CreateOfferingArgs>,
    GasOptions,
    FunctionCallExtraOptions {
  offeringStorageDeposit?: string;
}

export interface UpdateOfferingOptions
  extends RequiredArgsOptions<UpdateOfferingArgs>,
    GasOptions,
    FunctionCallExtraOptions {}

export interface RemoveOfferingOptions
  extends RequiredArgsOptions<RemoveOfferingArgs>,
    GasOptions,
    FunctionCallExtraOptions {}

// ================================================ View =======================================================
interface FunctionViewExtraOptions {
  blockQuery?: BlockQuery;
}

// ---------------------------------------------- Controller ---------------------------------------------------
export interface GetControllerOwnerIdOptions extends FunctionViewExtraOptions {
  registrantId: string;
}

// ---------------------------------------------- Core ---------------------------------------------------------
export interface NftIsRegisteredOptions extends RequiredArgsOptions<NftIsRegisteredArgs>, FunctionViewExtraOptions {}

export interface NftRegistrantIdsOfOptions
  extends RequiredArgsOptions<NftRegistrantIdsOfArgs>,
    FunctionViewExtraOptions {}

export interface NftStateOptions extends RequiredArgsOptions<NftStateArgs>, FunctionViewExtraOptions {}

export interface NftNameSkyTokenOptions extends RequiredArgsOptions<NftNameSkyTokenArgs>, FunctionViewExtraOptions {}

export interface NftNameSkyTokensOptions extends ArgsOptions<NftNameSkyTokensArgs>, FunctionViewExtraOptions {}

export interface NftNameSkyTokensForOwnerOptions
  extends RequiredArgsOptions<NftNameSkyTokensForOwnerArgs>,
    FunctionViewExtraOptions {}

export interface NftTotalSupplyOptions extends FunctionViewExtraOptions {}

export interface NftSupplyForOwnerOptions
  extends RequiredArgsOptions<NftSupplyForOwnerArgs>,
    FunctionViewExtraOptions {}

export interface GetLatestControllerCodeOptions extends FunctionViewExtraOptions {}

export interface GetLatestControllerCodeHashOptions extends FunctionViewExtraOptions {}

// ---------------------------------------------- Marketplace --------------------------------------------------
export interface GetAccountViewOfOptions extends RequiredArgsOptions<GetAccountViewOfArgs>, FunctionViewExtraOptions {}

export interface GetOfferingViewOptions extends RequiredArgsOptions<GetOfferingViewArgs>, FunctionViewExtraOptions {}

export interface GetOfferingViewsOptions extends ArgsOptions<GetOfferingViewsArgs>, FunctionViewExtraOptions {}

export interface GetOfferingViewsOfOptions
  extends RequiredArgsOptions<GetOfferingViewsOfArgs>,
    FunctionViewExtraOptions {}

export interface GetNftOfferingViewsOfOptions
  extends RequiredArgsOptions<GetNftOfferingViewsOfArgs>,
    FunctionViewExtraOptions {}

export interface GetOfferingUniqueIdOptions
  extends RequiredArgsOptions<getOfferingUniqueIdArgs>,
    FunctionViewExtraOptions {}

export interface GetListingViewOptions extends RequiredArgsOptions<GetListingViewArgs>, FunctionViewExtraOptions {}

export interface GetListingViewsOptions extends ArgsOptions<GetListingViewsArgs>, FunctionViewExtraOptions {}

export interface GetListingViewsOfOptions
  extends RequiredArgsOptions<GetListingViewsOfArgs>,
    FunctionViewExtraOptions {}

export interface GetListingUniqueIdOptions
  extends RequiredArgsOptions<GetListingUniqueIdArgs>,
    FunctionViewExtraOptions {}

export interface GetNftApprovalOptions extends RequiredArgsOptions<GetNftApprovalArgs>, FunctionViewExtraOptions {}
