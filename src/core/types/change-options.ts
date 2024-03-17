import { NftApproveArgs, NftRevokeArgs, NftTransferArgs } from 'multi-transaction';
import {
  AcceptOfferingArgs,
  AddFuelArgs,
  BuyListingArgs,
  CreateListingArgs,
  CreateMarketAccountArgs,
  CreateOfferingArgs,
  LikeArgs,
  NearDepositArgs,
  NearWithdrawArgs,
  NftRedeemArgs,
  NftUnregisterArgs,
  ReadNotificationAtArgs,
  RemoveListingArgs,
  RemoveOfferingArgs,
  UnlikeArgs,
  UnwatchArgs,
  UpdateListingArgs,
  UpdateOfferingArgs,
  WatchArgs,
} from './args';

interface ChangeFunctionExtraOptions {
  callbackUrl?: string;
}

// ---------------------------------------------- Registrant ---------------------------------------------------

export interface NftRegisterOptions {
  registrantId: string;
  gasForRegister?: string;
}

export interface SetupControllerOptions {
  registrantId: string;
  gasForCleanState?: string;
  gasForInit?: string;
}

export interface WaitForMintingOptions {
  registrantId: string;
  timeout?: number;
}

export interface MintOptions {
  registrantId: string;
  gasForRegister?: string;
  gasForCleanState?: string;
  gasForInit?: string;
}

// ---------------------------------------------- Core ---------------------------------------------------------

export interface NftUnregisterOptions extends ChangeFunctionExtraOptions {
  args: NftUnregisterArgs;
  gas?: string;
}

export interface NftRedeemOptions extends ChangeFunctionExtraOptions {
  args: NftRedeemArgs;
  gas?: string;
}

export interface NftTransferOptions extends ChangeFunctionExtraOptions {
  args: NftTransferArgs;
  gas?: string;
}

export interface NftApproveOptions extends ChangeFunctionExtraOptions {
  args: NftApproveArgs;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface NftRevokeOptions extends ChangeFunctionExtraOptions {
  args: NftRevokeArgs;
  gas?: string;
}

// ---------------------------------------------- Marketplace --------------------------------------------------

export interface CreateMarketAccountOption extends ChangeFunctionExtraOptions {
  args?: CreateMarketAccountArgs;
  marketStorageDeposit?: string;
  gas?: string;
}

export interface NearDepositOptions extends ChangeFunctionExtraOptions {
  args?: NearDepositArgs;
  attachedDeposit: string;
  gas?: string;
}

export interface NearWithdrawOptions extends ChangeFunctionExtraOptions {
  args?: NearWithdrawArgs;
  gas?: string;
}

export interface BuyListingOptions extends ChangeFunctionExtraOptions {
  args: BuyListingArgs;
  gas?: string;
}

export interface CreateListingOptions extends ChangeFunctionExtraOptions {
  args: CreateListingArgs;
  listingStorageDeposit?: string;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface UpdateListingOptions extends ChangeFunctionExtraOptions {
  args: UpdateListingArgs;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface RemoveListingOptions extends ChangeFunctionExtraOptions {
  args: RemoveListingArgs;
  gas?: string;
}

export interface AcceptOfferingOptions extends ChangeFunctionExtraOptions {
  args: AcceptOfferingArgs;
  approvalStorageDeposit?: string;
  gas?: string;
}

export interface CreateOfferingOptions extends ChangeFunctionExtraOptions {
  args: CreateOfferingArgs;
  offeringStorageDeposit?: string;
  gas?: string;
}

export interface UpdateOfferingOptions extends ChangeFunctionExtraOptions {
  args: UpdateOfferingArgs;
  gas?: string;
}

export interface RemoveOfferingOptions extends ChangeFunctionExtraOptions {
  args: RemoveOfferingArgs;
  gas?: string;
}

// ---------------------------------------------- User Setting --------------------------------------------------

export interface LikeOptions extends ChangeFunctionExtraOptions {
  args: LikeArgs;
  gas?: string;
}

export interface UnlikeOptions extends ChangeFunctionExtraOptions {
  args: UnlikeArgs;
  gas?: string;
}

export interface WatchOptions extends ChangeFunctionExtraOptions {
  args: WatchArgs;
  gas?: string;
}

export interface UnwatchOptions extends ChangeFunctionExtraOptions {
  args: UnwatchArgs;
  gas?: string;
}

export interface ReadNotificationAtOptions extends ChangeFunctionExtraOptions {
  args?: ReadNotificationAtArgs;
  gas?: string;
}

// ---------------------------------------------- Spaceship -----------------------------------------------------

export interface MintSpaceshipOptions extends ChangeFunctionExtraOptions {
  spaceshipStorageDeposit?: string;
  gas?: string;
}

export interface AddFuelOptions extends ChangeFunctionExtraOptions {
  args: AddFuelArgs;
  gas?: string;
}

export interface DistributeAndClaimRewardsOptions extends ChangeFunctionExtraOptions {
  skyTokenId: string;
  gasForDistribute?: string;
  gasForClaim?: string;
}
