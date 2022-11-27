import {FunctionCallOptions} from "../../utils";
import {NftRegisterArgs} from "./args";
import {Optional} from "@near-wallet-selector/core";

export interface SetupControllerOptions {
  registrantId: string
  code: Buffer
  gasForCleanState?: string
  gasForInit?: string
}

export interface NftRegisterOptions extends FunctionCallOptions<Optional<NftRegisterArgs, 'minter_id'>> {
  registrantId: string
}
