import {FunctionCallOptions} from "../../utils";
import {NftRegisterArgs} from "./args";

export interface SetupControllerOptions {
  registrantId: string
  code: Buffer
  gasForCleanState?: string
  gasForInit?: string
}

export interface NftRegisterOptions extends FunctionCallOptions<NftRegisterArgs> {
  registrantId: string
}
