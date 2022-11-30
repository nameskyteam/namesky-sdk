import { FunctionCallOptions, NftTransferArgs } from "../../utils";
import { CreateOfferingArgs, NftRedeemArgs, NftRegisterArgs } from "./args";
import { Optional } from "@near-wallet-selector/core";

interface CommonOptions {
  callbackUrl?: string;
}

// ----------------------------------------------Controller---------------------------------------------------------

export interface SetupControllerOptions {
  registrantId: string;
  code: Buffer;
  gasForCleanState?: string;
  gasForInit?: string;
}

// ------------------------------------------------Nft-------------------------------------------------------------

export interface NftRegisterOptions
  extends FunctionCallOptions<Optional<NftRegisterArgs, "minter_id">> {
  registrantId: string;
}

export interface NftRedeemOptions
  extends FunctionCallOptions<NftRedeemArgs>,
    CommonOptions {}

export interface NftTransferOptions
  extends FunctionCallOptions<NftTransferArgs>,
    CommonOptions {}

// ------------------------------------------------Market---------------------------------------------------------

export interface CreateOfferingOptions
  extends FunctionCallOptions<CreateOfferingArgs>,
    CommonOptions {}
