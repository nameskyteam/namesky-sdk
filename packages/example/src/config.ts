import { NameSkyConfig } from '../../namesky-sdk/src';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

export interface Config {
  namesky: NameSkyConfig;
}

export const config: Config = {
  namesky: {
    selector: {
      network: 'testnet',
      modules: [setupNearWallet(), setupMyNearWallet()],
      keyStorePrefix: 'registrant:keystore:',
    },
    contracts: {
      coreContractId: 'core.namesky.testnet',
      marketplaceContractId: 'core.namesky.testnet',
    },
  },
};
