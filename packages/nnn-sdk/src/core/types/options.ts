import { ArgsOptions, AttachedDepositOptions, BlockQuery, GasOptions, MethodArgs, NftTransferArgs } from '../../utils';
import {
  CreateListingArgs,
  CreateOfferingArgs,
  GetAccountViewOfArgs,
  GetOfferingViewArgs,
  NftIsRegisteredArgs,
  NftRedeemArgs,
  NftRegisterArgs,
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

// ------------------------------------------------ Nft --------------------------------------------------------
export interface NftRegisterOptions extends RequiredArgsOptions<NftRegisterArgs>, AttachedDepositOptions, GasOptions {
  registrantId: string;
}

export interface NftRedeemOptions extends RequiredArgsOptions<NftRedeemArgs>, GasOptions, FunctionCallExtraOptions {}

export interface NftTransferOptions
  extends RequiredArgsOptions<NftTransferArgs>,
    GasOptions,
    FunctionCallExtraOptions {}

// ------------------------------------------------ Market -----------------------------------------------------
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

// ------------------------------------------------ Nft --------------------------------------------------------
export interface NftIsRegisteredOptions extends RequiredArgsOptions<NftIsRegisteredArgs>, FunctionViewExtraOptions {}

// ------------------------------------------------ Market -----------------------------------------------------
export interface GetAccountViewOfOptions extends RequiredArgsOptions<GetAccountViewOfArgs>, FunctionViewExtraOptions {}

export interface GetOfferingViewOptions extends RequiredArgsOptions<GetOfferingViewArgs>, FunctionViewExtraOptions {}
