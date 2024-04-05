import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { UserSettingContract } from '../contracts/UserSettingContract';
import { SpaceshipContract } from '../contracts/SpaceshipContract';
import { keyStores } from 'near-api-js';
import { NameSkySigner } from '../NameSkySigner';

export type NameSkyComponent = {
  signer: NameSkySigner;
  registrantKeyStore: keyStores.KeyStore;

  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
  spaceshipContract: SpaceshipContract;
};

export type Network = {
  networkId: NetworkId;
  nodeUrl: string;
};

export type NetworkId = 'mainnet' | 'testnet' | string;

export type NameSkyOptions = {
  signer: NameSkySigner;
  registrantKeyStore?: keyStores.KeyStore,
  contracts?: {
    coreContractId?: string;
    marketplaceContractId?: string;
    userSettingContractId?: string;
    spaceshipContractId?: string;
  };
};
