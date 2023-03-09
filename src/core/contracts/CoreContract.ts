import { Contract } from '../../utils/Contract';
import { DEFAULT_APPROVAL_STORAGE_DEPOSIT, DEFAULT_MINT_FEE, MultiTransaction } from '../../utils';
import { Amount } from '../../utils';
import {
  GetLatestControllerCodeHashOptions,
  GetLatestControllerCodeOptions,
  NftApproveOptions,
  NftIsRegisteredOptions,
  NftNameSkyTokenOptions,
  NftNameSkyTokensForOwnerOptions,
  NftNameSkyTokensOptions,
  NftRedeemOptions,
  NftRegisterOptions,
  NftRegistrantIdsOfOptions,
  NftRevokeOptions,
  NftStateOptions,
  NftSupplyForOwnerOptions,
  NftTotalSupplyOptions,
  NftTransferOptions,
  NftUnregisterOptions,
} from '../types/options';
import { NameSkyToken, TokenState } from '../types/data';

export class CoreContract extends Contract {
  // ------------------------------------------------- View -------------------------------------------------------

  async nft_is_registered({ args, blockQuery }: NftIsRegisteredOptions): Promise<string | null> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args,
      blockQuery,
    });
  }

  async nft_registrant_ids_of({ args, blockQuery }: NftRegistrantIdsOfOptions): Promise<string[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_registrant_ids_of',
      args,
      blockQuery,
    });
  }

  async nft_state({ args, blockQuery }: NftStateOptions): Promise<TokenState | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_state',
      args,
      blockQuery,
    });
  }

  async nft_namesky_token({ args, blockQuery }: NftNameSkyTokenOptions): Promise<NameSkyToken | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_namesky_token',
      args,
      blockQuery,
    });
  }

  async nft_namesky_tokens({ args, blockQuery }: NftNameSkyTokensOptions): Promise<NameSkyToken[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens',
      args,
      blockQuery,
    });
  }

  async nft_namesky_tokens_for_owner({ args, blockQuery }: NftNameSkyTokensForOwnerOptions): Promise<NameSkyToken[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens_for_owner',
      args,
      blockQuery,
    });
  }

  async nft_supply_for_owner({ args, blockQuery }: NftSupplyForOwnerOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_supply_for_owner',
      args,
      blockQuery,
    });
  }

  async nft_total_supply({ blockQuery }: NftTotalSupplyOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_total_supply',
      blockQuery,
    });
  }

  async get_latest_controller_code({ blockQuery }: GetLatestControllerCodeOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code',
      blockQuery,
    });
  }

  async get_latest_controller_code_hash({ blockQuery }: GetLatestControllerCodeHashOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code_hash',
      blockQuery,
    });
  }

  // -------------------------------------------------- Call -------------------------------------------------------

  // signed by registrant
  async nftRegister({ registrantId, args, gas, attachedDeposit }: NftRegisterOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'nft_register',
      args,
      attachedDeposit: attachedDeposit ?? DEFAULT_MINT_FEE,
      gas,
    });
    await this.selector.sendWithLocalKey(registrantId, transaction);
  }

  async nftUnregister({ args, gas, callbackUrl }: NftUnregisterOptions): Promise<boolean> {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'nft_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
    return this.selector.send(transaction, { callbackUrl, throwReceiptsErrorIfAny: true });
  }

  async nftRedeem({ args, gas, callbackUrl }: NftRedeemOptions): Promise<boolean> {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'nft_redeem',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
    return this.selector.send(transaction, { callbackUrl, throwReceiptsErrorIfAny: true });
  }

  async nftTransfer({ args, gas, callbackUrl }: NftTransferOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).nft_transfer({
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async nftApprove({ args, attachedDeposit, gas, callbackUrl }: NftApproveOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).nft_approve({
      args,
      attachedDeposit: attachedDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async nftRevoke({ args, gas, callbackUrl }: NftRevokeOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).nft_revoke({
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }
}
