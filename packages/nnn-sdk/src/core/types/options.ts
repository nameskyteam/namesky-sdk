import { ArgsOptions, AttachedDepositOptions, GasOptions, NftTransferArgs, RequiredArgsOptions } from '../../utils';
import { CreateOfferingArgs, GetAccountViewOfArgs, NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs } from './args';
import { Optional } from '@near-wallet-selector/core';
import { BlockReference } from 'near-api-js/lib/providers/provider';

// ================================================ Call =======================================================
interface FunctionCallExtraOptions {
  callbackUrl?: string;
}

interface AttachedDepositAndGasOptions extends AttachedDepositOptions, GasOptions {}

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
    AttachedDepositAndGasOptions {
  registrantId: string;
}

export interface NftRedeemOptions
  extends RequiredArgsOptions<NftRedeemArgs>,
    AttachedDepositAndGasOptions,
    FunctionCallExtraOptions {}

export interface NftTransferOptions
  extends RequiredArgsOptions<NftTransferArgs>,
    AttachedDepositAndGasOptions,
    FunctionCallExtraOptions {}

// ------------------------------------------------ Market -----------------------------------------------------
export interface CreateOfferingOptions
  extends RequiredArgsOptions<CreateOfferingArgs>,
    AttachedDepositAndGasOptions,
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
