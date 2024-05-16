import { CoreContract, MarketplaceContract, UserSettingContract, NameSkySigner } from '../core';
import { keyStores } from 'near-api-js';

export type NameSkyComponent = {
  signer: NameSkySigner;
  registrantKeyStore: keyStores.KeyStore;

  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
};

export type Network = {
  networkId: NetworkId;
  nodeUrl: string;
};

export type NetworkId = 'mainnet' | 'testnet' | string;

export type NameSkyOptions = {
  signer: NameSkySigner;
  registrantKeyStore?: keyStores.KeyStore;
  contracts?: {
    coreContractId?: string;
    marketplaceContractId?: string;
    userSettingContractId?: string;
  };
};
