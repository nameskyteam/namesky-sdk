import { CoreContract, MarketplaceContract, UserSettingContract, NameSkyUser } from '../core';
import { KeyStore } from '@near-js/keystores';

export type NameSkyComponent = {
  user: NameSkyUser;
  registrantKeyStore: KeyStore;

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
  user: NameSkyUser;
  registrantKeyStore?: KeyStore;
  contracts?: {
    coreContractId?: string;
    marketplaceContractId?: string;
    userSettingContractId?: string;
  };
};
