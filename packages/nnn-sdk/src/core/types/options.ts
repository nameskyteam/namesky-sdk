import { NftTransferArgs } from '../../utils';
import { CreateOfferingArgs, GetAccountViewOfArgs, NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs } from './args';
import { Optional } from '@near-wallet-selector/core';
import { BlockReference } from 'near-api-js/lib/providers/provider';

// ================================================ Call =======================================================
interface FunctionCallOptionsWithoutArgs {
  attachedDeposit?: string;
  gas?: string;
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
export interface NftRegisterOptions extends FunctionCallOptionsWithoutArgs {
  registrantId: string;
  args?: Optional<NftRegisterArgs, 'minter_id'>;
}

export interface NftRedeemOptions extends FunctionCallOptionsWithoutArgs {
  args: NftRedeemArgs;
}

export interface NftTransferOptions extends FunctionCallOptionsWithoutArgs {
  args: NftTransferArgs;
}

// ------------------------------------------------ Market -----------------------------------------------------
export interface CreateOfferingOptions extends FunctionCallOptionsWithoutArgs {
  args: CreateOfferingArgs;
}

// ================================================ View =======================================================
interface FunctionViewOptionsWithoutArgs {
  blockQuery?: BlockReference;
}

// ---------------------------------------------- Controller ---------------------------------------------------
export interface GetControllerOwnerIdOptions extends FunctionViewOptionsWithoutArgs {
  registrantId: string;
}

// ------------------------------------------------ Nft --------------------------------------------------------
export interface NftIsRegisteredOptions extends FunctionViewOptionsWithoutArgs {
  args: NftIsRegisteredArgs;
}

// ------------------------------------------------ Market -----------------------------------------------------
export interface GetAccountViewOfOptions extends FunctionViewOptionsWithoutArgs {
  args: GetAccountViewOfArgs;
}
