import { ArgsOptions, AttachedDepositOptions, BlockQuery, GasOptions, NftTransferArgs } from '../../utils';
import { CreateOfferingArgs, GetAccountViewOfArgs, NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs } from './args';

// ================================================ Call =======================================================
interface FunctionCallExtraOptions {
  callbackUrl?: string;
}

type RequiredArgsOptions<Args extends object | Uint8Array> = Required<ArgsOptions<Args>>;

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
export interface CreateOfferingOptions
  extends RequiredArgsOptions<CreateOfferingArgs>,
    GasOptions,
    FunctionCallExtraOptions {
  storageDeposit: string;
}

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
