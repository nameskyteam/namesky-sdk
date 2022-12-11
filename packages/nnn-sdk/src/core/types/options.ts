import { ArgsOptions, AttachedDepositOptions, GasOptions, NftTransferArgs, RequiredArgsOptions } from '../../utils';
import { CreateOfferingArgs, GetAccountViewOfArgs, NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs } from './args';
import { Optional } from '@near-wallet-selector/core';
import { BlockReference } from 'near-api-js/lib/providers/provider';

// ================================================ Call =======================================================
interface FunctionCallExtraOptions {
  callbackUrl?: string;
}

// ---------------------------------------------- Controller ---------------------------------------------------
export interface SetupControllerOptions {
  registrantId: string;
  code: Buffer;
  gasForCleanState?: string;
  gasForInit?: string;
}

// ------------------------------------------------ Nft --------------------------------------------------------
export interface NftRegisterOptions
  extends ArgsOptions<Optional<NftRegisterArgs, 'minter_id'>>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {
  registrantId: string;
}

export interface NftRedeemOptions
  extends RequiredArgsOptions<NftRedeemArgs>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {}

export interface NftTransferOptions
  extends RequiredArgsOptions<NftTransferArgs>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {}

// ------------------------------------------------ Market -----------------------------------------------------
export interface CreateOfferingOptions
  extends RequiredArgsOptions<CreateOfferingArgs>,
    AttachedDepositOptions,
    GasOptions,
    FunctionCallExtraOptions {}

// ================================================ View =======================================================
interface FunctionViewExtraOptions {
  blockQuery?: BlockReference;
}

// ---------------------------------------------- Controller ---------------------------------------------------
export interface GetControllerOwnerIdOptions extends FunctionViewExtraOptions {
  registrantId: string;
}

// ------------------------------------------------ Nft --------------------------------------------------------
export interface NftIsRegisteredOptions extends RequiredArgsOptions<NftIsRegisteredArgs>, FunctionViewExtraOptions {}

// ------------------------------------------------ Market -----------------------------------------------------
export interface GetAccountViewOfOptions extends RequiredArgsOptions<GetAccountViewOfArgs>, FunctionViewExtraOptions {}
