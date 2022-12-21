import { WalletSelectorPlus } from '../../utils';
import { NftContract } from '../contracts';
import { MarketContract } from '../contracts';
import { WalletSelectorPlusConfig } from '../../utils';

export interface NameSkyComponent {
  selector: WalletSelectorPlus;
  nftContract: NftContract;
  marketContract: MarketContract;
}

export interface NameSkyConfig {
  selector: WalletSelectorPlusConfig;
  contracts: {
    nftContractId: string;
    marketContractId: string;
  };
}
