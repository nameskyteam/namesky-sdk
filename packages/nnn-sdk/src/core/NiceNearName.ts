import {getBase58CodeHash, WalletSelectorPlus} from "../utils";
import {NftContract} from "./contracts";
import {MarketContract} from "./contracts";
import {KeyPairEd25519, PublicKey} from "near-api-js/lib/utils";
import {
  REQUEST_ACCESS_PENDING_KEY_PREFIX
} from "../utils";
import {Network} from "@near-wallet-selector/core";
import {NiceNearNameComponent, NiceNearNameConfig} from "./types/config";
import {Account} from "near-api-js";
import {CleanStateArgs, InitArgs} from "./types/args";
import {MultiTransaction} from "../utils";
import {Amount} from "../utils";
import {setupWalletSelectorPlus} from "../utils";
import {SetupControllerOptions} from "./types/options";
import sha256 from "sha256";

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

    this.onRequestFullAccess()
      .then(() => console.log('onRequestFullAccess Success'))
      .catch((reason) => console.error('onRequestFullAccess Failed', reason))
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

  account(accountId: string): Promise<Account> {
    return this.selector.near.account(accountId)
  }

  async requestFullAccess(
    webWalletBaseUrl: string,
    successUrl?: string,
    failureUrl?: string
  ) {
    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.getPublicKey().toString();
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + publicKey
    const keystore = this.selector.keyStore()
    const networkId = this.getNetworkId()
    await keystore.setKey(networkId, pendingAccountId, keyPair)
    const newUrl = new URL(webWalletBaseUrl + '/login/');
    newUrl.searchParams.set("public_key", publicKey);
    newUrl.searchParams.set("success_url", successUrl ?? window.location.href);
    newUrl.searchParams.set("failure_url", failureUrl ?? window.location.href);
    window.location.assign(newUrl.toString());
  }

  // auto callback
  private async onRequestFullAccess() {
    const currentUrl = new URL(window.location.href)
    const publicKey = currentUrl.searchParams.get('public_key')
    const accountId = currentUrl.searchParams.get('account_id')
    if (!publicKey || !accountId) {
      return
    }
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + PublicKey.fromString(publicKey).toString()
    const keystore = this.selector.keyStore()
    const networkId = this.getNetworkId()
    const keyPair = await keystore.getKey(networkId, pendingAccountId)
    if (!keyPair) {
      return
    }
    await keystore.setKey(networkId, accountId, keyPair)
    await keystore.removeKey(networkId, pendingAccountId)
  }

  // signed by registrant
  async setupController({
    registrantId,
    code,
    gasForCleanState,
    gasForInit
  }: SetupControllerOptions) {
    const account = await this.account(registrantId)

    const contractState = await account.viewState('')
    const contractStateKeys = contractState.map(({key}) => key.toString('base64'))

    const accountState = await account.state()
    const accountCodeHash = accountState.code_hash
    const codeHash = getBase58CodeHash(code)

    const ownerId = await this.getControllerOwnerId(registrantId)

    const accessKeys = await account.getAccessKeys()
    const publicKeys = accessKeys.map(accessKey => accessKey.public_key)

    const isCodeHashVerified = codeHash === accountCodeHash
    const isContractStateVerified = contractStateKeys.length === 1
    const isOwnerIdVerified = ownerId === this.nftContract.contractId
    const isAccessKeyVerified = publicKeys.length === 0

    const isContractStateClear = contractStateKeys.length === 0

    if (isCodeHashVerified && isContractStateVerified && isOwnerIdVerified && isAccessKeyVerified) {
      // skip
      return
    }

    const transaction = new MultiTransaction(registrantId)

    transaction.deployContract(code)

    if (!isContractStateClear) {
      transaction.functionCall<CleanStateArgs>({
        methodName: 'clean_state',
        args: {
          keys: contractStateKeys
        },
        attachedDeposit: Amount.ONE_YOCTO,
        gas: gasForCleanState
      })
    }

    transaction.functionCall<InitArgs>({
      methodName: 'init',
      args: {
        owner_id: this.getNftContractId()
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gasForInit
    })

    publicKeys.forEach(publicKey => transaction.deleteKey(publicKey))

    await this.selector.sendWithLocalKey(registrantId, transaction)
  }

  async getControllerOwnerId(registrantId: string): Promise<string | undefined> {
    try {
      return await this.selector.view({
        contractId: registrantId,
        methodName: 'get_owner_id',
        args: {}
      })
    } catch (e) {
      console.warn(`Get controller owner id failed, registrant id: ${registrantId}, message: ${(e as any).message}`)
      return void 0
    }
  }
}

export async function initNiceNearName(
  config: NiceNearNameConfig
): Promise<NiceNearName> {
  const selector = await setupWalletSelectorPlus(config.selector)
  const nftContract = new NftContract(config.contracts.nftContractId, selector)
  const marketContract = new MarketContract(config.contracts.marketContractId, selector)
  return new NiceNearName({selector,  nftContract, marketContract})
}
