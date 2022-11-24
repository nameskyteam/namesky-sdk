import {SpecificFunctionCallOptions} from "../../utils";
import {NftRegisterArgs} from "./args";

export interface SetupControllerOptions {
  registrantId: string
  code: Uint8Array
  gasForCleanState?: string
  gasForInit?: string
}

export interface NftRegisterOptions extends SpecificFunctionCallOptions<NftRegisterArgs> {
  registrantId: string
}
