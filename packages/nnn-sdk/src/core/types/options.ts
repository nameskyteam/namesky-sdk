import {FunctionCallOptions} from "../../utils";
import {CreateOfferingArgs, NftRegisterArgs} from "./args";
import {Optional} from "@near-wallet-selector/core";

// ----------------------------------------------Controller---------------------------------------------------------

export interface SetupControllerOptions {
  registrantId: string
  code: Buffer
  gasForCleanState?: string
  gasForInit?: string
}

// ------------------------------------------------Nft-------------------------------------------------------------

export interface NftRegisterOptions extends FunctionCallOptions<Optional<NftRegisterArgs, 'minter_id'>> {
  registrantId: string
}

// ------------------------------------------------Market---------------------------------------------------------

export interface CreateOfferingOptions extends FunctionCallOptions<CreateOfferingArgs> {}
