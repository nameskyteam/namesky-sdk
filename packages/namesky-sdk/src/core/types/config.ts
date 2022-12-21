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
  selector: WalletSelectorPlusConfig;
  contracts: {
    coreContractId: string;
    marketplaceContractId: string;
  };
}
