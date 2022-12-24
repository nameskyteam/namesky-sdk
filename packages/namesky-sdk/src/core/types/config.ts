import { WalletSelectorPlus } from '../../utils';
import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { WalletSelectorPlusConfig } from '../../utils';

export interface NameSkyComponent {
  selector: WalletSelectorPlus;
  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
}

export interface NameSkyConfig {
  selectorConfig: WalletSelectorPlusConfig;
  contractsConfig: {
    coreContractId: string;
    marketplaceContractId: string;
  };
}
