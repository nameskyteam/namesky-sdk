import {WalletSelectorParams} from "@near-wallet-selector/core/lib/wallet-selector.types";
import {WalletModule} from "./wallet";
import {Modify} from "@near-wallet-selector/core/lib/utils.types";

export type WalletSelectorPlusConfig = Modify<WalletSelectorParams, { modules: WalletModule[], keyStorePrefix?: string }>
