import {WalletSelectorPlus} from "../utils/wallet-selector-plus/types/enhancement";
import {NftContract} from "./contracts/NftContract";
import {MarketContract} from "./contracts/MarketContract";
import {KeyPairEd25519, PublicKey} from "near-api-js/lib/utils";
import {
  REQUEST_ACCESS_PENDING_KEY_PREFIX
} from "../utils/common";
import {Network} from "@near-wallet-selector/core";
import {Amount} from "../utils/wallet-selector-plus/utils/Amount";
import {setupWalletSelectorPlus} from "../utils/wallet-selector-plus/WalletSelectorPlus";
import {NiceNearNameComponent, NiceNearNameConfig} from "./types/config";
import {NearTransaction} from "../utils/wallet-selector-plus/core/NearTransaction";
import {Account} from "near-api-js";
import {CleanStateArgs, InitArgs} from "./types/args/NftContract";

export class NiceNearName {
  selector: WalletSelectorPlus
  nftContract: NftContract
  marketContract: MarketContract

  constructor({
    selector,
    nftContract,
    marketContract
  }: NiceNearNameComponent) {
    this.selector = selector
    this.nftContract = nftContract
    this.marketContract = marketContract

    this.onRequestFullAccess().then(() => {})
  }

  getNetwork(): Network {
    return this.selector.options.network
  }

  getNetworkId(): string {
    return this.getNetwork().networkId
  }

  getNftContractId(): string {
    return this.nftContract.contractId
  }

  getMarketContractId(): string {
    return this.marketContract.contractId
  }

  account(accountId?: string): Promise<Account> {
    return this.selector.near.account(accountId ?? '')
  }

  async requestFullAccess(
    webWalletBaseUrl: string,
    successUrl?: string,
    failureUrl?: string
  ) {
    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.getPublicKey().toString();
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + publicKey
    const keystore = this.selector.getKeyStore()
    const networkId = this.getNetworkId()
    await keystore.setKey(networkId, pendingAccountId, keyPair)
    const newUrl = new URL(webWalletBaseUrl + '/login/');
    newUrl.searchParams.set("public_key", publicKey);
    newUrl.searchParams.set("success_url", successUrl ?? window.location.href);
    newUrl.searchParams.set("failure_url", failureUrl ?? window.location.href);
    window.location.assign(newUrl.toString());
  }

  private async onRequestFullAccess() {
    const currentUrl = new URL(window.location.href)
    const publicKey = currentUrl.searchParams.get('public_key')
    const accountId = currentUrl.searchParams.get('account_id')
    if (!publicKey || !accountId) {
      return
    }
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + PublicKey.fromString(publicKey).toString()
    const keystore = this.selector.getKeyStore()
    const networkId = this.getNetworkId()
    const keyPair = await keystore.getKey(networkId, pendingAccountId)
    if (!keyPair) {
      return
    }
    await keystore.setKey(networkId, accountId, keyPair)
    await keystore.removeKey(networkId, pendingAccountId)
  }

  async setupController(
    registrantId: string,
    code: Uint8Array,
    options?: {
      gasForCleanState?: string,
      gasForInit?: string
    }
  ) {
    const account = await this.account(registrantId)
    const state = await account.viewState('')
    const stateKeys = state.map(({key}) => key.toString('base64'))
    const accessKeys = await account.getAccessKeys()
    const publicKeys = accessKeys.map(accessKey => accessKey.public_key)

    const transaction = new NearTransaction(registrantId)
      .deployContract(code)
      .functionCall<CleanStateArgs>({
        methodName: 'clean_state',
        args: {
          keys: stateKeys
        },
        attachedDeposit: Amount.ONE_YOCTO,
        gas: options?.gasForCleanState
      })
      .functionCall<InitArgs>({
        methodName: 'init',
        args: {
          owner_id: this.getNftContractId()
        },
        attachedDeposit: Amount.ONE_YOCTO,
        gas: options?.gasForInit
      })

    publicKeys.map(publicKey => transaction.deleteKey(publicKey))

    await this.selector.sendWithLocalKey(registrantId, transaction)
  }
}

export async function initNiceNearName(
  config: NiceNearNameConfig
): Promise<NiceNearName> {
  const selector = await setupWalletSelectorPlus(config.selector)
  const nftContract = new NftContract(config.contracts.nftContractId, selector)
  const marketContract = new MarketContract(config.contracts.marketContractId, selector)
  return new NiceNearName({selector, nftContract, marketContract})
}
