import {
  AcceptOfferingArgs,
  AddFuelArgs,
  CreateOfferingArgs,
  LikeArgs,
  ReadNotificationAtArgs,
  RemoveListingArgs,
  RemoveOfferingArgs,
  UnlikeArgs,
  UnwatchArgs,
  UpdateListingArgs,
  UpdateOfferingArgs,
  WatchArgs,
} from './args';
import { UpdateWrapper } from './common';

type ChangeFunctionExtraOptions = {
  callbackUrl?: string;
};

// ---------------------------------------------- Registrant ---------------------------------------------------

export type NftRegisterOptions = {
  registrantId: string;
};

export type SetupControllerOptions = {
  registrantId: string;
  gasForCleanState?: string;
};

// ---------------------------------------------- Core ---------------------------------------------------------

export type NftUnregisterOptions = ChangeFunctionExtraOptions & {
  registrantId: string;
  publicKey: string;
  force?: boolean;
};

export type NftRedeemOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  publicKey: string;
  force?: boolean;
  memo?: string;
};

export type NftTransferOptions = ChangeFunctionExtraOptions & {
  receiverId: string;
  tokenId: string;
  approvalId?: number;
  memo?: string;
};

export type NftApproveOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  accountId: string;
  msg?: string;
};

export type NftRevokeOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  accountId: string;
};

// ---------------------------------------------- Marketplace --------------------------------------------------

export type CreateMarketAccountOption = ChangeFunctionExtraOptions & {};

export type NearDepositOptions = ChangeFunctionExtraOptions & {
  amount: string;
};

export type NearWithdrawOptions = ChangeFunctionExtraOptions & {
  amount?: string;
};

export type BuyListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type CreateListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  price: string;
  expireTime?: number;
};

export type UpdateListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  newPrice?: string;
  newExpireTime?: UpdateWrapper<number>;
};

export type RemoveListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type AcceptOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  buyerId: string;
};

export type CreateOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  price: string;
  expireTime?: number;
  isSimpleOffering?: boolean;
};

export type UpdateOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  newPrice?: string;
  newExpireTime?: UpdateWrapper<number>;
};

export type RemoveOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

// ---------------------------------------------- User Setting --------------------------------------------------

export type LikeOptions = ChangeFunctionExtraOptions & {
  args: LikeArgs;
  gas?: string;
};

export type UnlikeOptions = ChangeFunctionExtraOptions & {
  args: UnlikeArgs;
  gas?: string;
};

export type WatchOptions = ChangeFunctionExtraOptions & {
  args: WatchArgs;
  gas?: string;
};

export type UnwatchOptions = ChangeFunctionExtraOptions & {
  args: UnwatchArgs;
  gas?: string;
};

export type ReadNotificationAtOptions = ChangeFunctionExtraOptions & {
  args?: ReadNotificationAtArgs;
  gas?: string;
};

// ---------------------------------------------- Spaceship -----------------------------------------------------

export type MintSpaceshipOptions = ChangeFunctionExtraOptions & {
  spaceshipStorageDeposit?: string;
  gas?: string;
};

export type AddFuelOptions = ChangeFunctionExtraOptions & {
  args: AddFuelArgs;
  gas?: string;
};

export type DistributeAndClaimRewardsOptions = ChangeFunctionExtraOptions & {
  skyTokenId: string;
  gasForDistribute?: string;
  gasForClaim?: string;
};
