import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { UserSettingContract } from '../contracts/UserSettingContract';
import { SpaceshipContract } from '../contracts/SpaceshipContract';
import { keyStores } from 'near-api-js';
import { NameSkySigner } from '../NameSkySigner';

export interface NameSkyComponent {
  network: Network;
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

export type NetworkId = 'mainnet' | 'testnet';

export interface NameSkyOptions {
  network: Network | NetworkId;
  signer: NameSkySigner;
  contracts?: {
    coreContractId?: string;
    marketplaceContractId?: string;
    userSettingContractId?: string;
    spaceshipContractId?: string;
  };
}
