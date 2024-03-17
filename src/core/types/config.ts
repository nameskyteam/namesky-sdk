import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { UserSettingContract } from '../contracts/UserSettingContract';
import { SpaceshipContract } from '../contracts/SpaceshipContract';
import { keyStores } from 'near-api-js';
import { NameSkySigner } from '../NameSkySigner';

export interface NameSkyComponent {
  signer: NameSkySigner;
  keyStore: keyStores.KeyStore;

  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
  spaceshipContract: SpaceshipContract;
}

export interface Network {
  networkId: NetworkId;
  nodeUrl: string;
}

export type NetworkId = 'mainnet' | 'testnet' | string;

export interface NameSkyOptions {
  signer: NameSkySigner;
  contracts?: {
    coreContractId?: string;
    marketplaceContractId?: string;
    userSettingContractId?: string;
    spaceshipContractId?: string;
  };
}
