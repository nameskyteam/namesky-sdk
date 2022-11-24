import {SpecificFunctionCallOptions} from "../common";
import {FtTransferArgs, FtTransferCallArgs} from "./args";

export type FtTransferOptions = Omit<SpecificFunctionCallOptions<FtTransferArgs>, 'attachedDeposit'>

export type FtTransferCallOptions = Omit<SpecificFunctionCallOptions<FtTransferCallArgs>, 'attachedDeposit'>
