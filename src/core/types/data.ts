import { BlockQuery, Token } from 'multi-transaction';
import { State } from './common';
import { AccessKeyInfoView } from '@near-js/types';

// ---------------------------------------------- Controller ---------------------------------------------------

export type NameSkyNftSafety = {
  blockQuery: BlockQuery;
  isCodeHashCorrect: boolean;
  isStateCleaned: boolean;
  isAccessKeysDeleted: boolean;
  isControllerOwnerIdCorrect: boolean;
  codeHash: string;
  state: State[];
  accessKeys: AccessKeyInfoView[];
  controllerOwnerId?: string;
};

// ---------------------------------------------- Core ---------------------------------------------------------

export type TokenState = 'Active' | 'OnMinting' | 'OnBurning' | Frozen;

export type Frozen = { Frozen: { memo: string } };

export type NameSkyToken = Token & {
  token_state: TokenState;
};

export type RoyaltyView = {
  royalty: number;
  divisor: number;
};

export type ControllerCodeView = {
  version: number;
  code_hash: string;
  code_len: number;
  code_memo?: string;
  is_state_broken: boolean;
};

// ---------------------------------------------- Marketplace --------------------------------------------------

export type AccountView = {
  account_id: string;
  near_balance: string;
  total_storage_balance: string;
  available_storage_balance: string;
};

export type ListingView = {
  id: string;
  listing_id: [string, string];
  seller_id: string;
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  nft_approval_id?: number;
};

export type OfferingView = {
  id: string;
  offering_id: [string, string, string];
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  is_simple_offering: boolean;
};

export type Approval = {
  owner_id: string;
  approval_id: number;
};

export type MarketplaceConfig = {
  // 10000 = 100.00 %
  listing_trading_fee: number;
  // 10000 = 100.00 %
  offering_trading_fee: number;
  // min storage usage
  min_storage_usage: number;
};

export type TradingFeeRate = {
  listing: number;
  offering: number;
};

// ---------------------------------------------- Spaceship ----------------------------------------------------

export type SpaceshipEngine = {
  added_fuel_num: string;
  energy: string;
  consumed_energy: string;
  speed: string;
  settled_at: number;
};
