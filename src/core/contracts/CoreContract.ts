import { Contract } from '../../utils/Contract';
import { DEFAULT_APPROVAL_STORAGE_DEPOSIT } from '../../utils';
import { Amount, MultiTransaction } from 'multi-transaction';
import {
  GetControllerCodeViewsOptions,
  GetLatestControllerCodeHashOptions,
  GetLatestControllerCodeOptions,
  GetMintFeeOptions,
  GetRoyaltyOptions,
  NftApproveOptions,
  NftGetMinterIdOptions,
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
import { ControllerCodeView, NameSkyToken, RoyaltyView, TokenState } from '../types/data';

export class CoreContract extends Contract {
  // ------------------------------------------------- View -------------------------------------------------------

  async nft_get_minter_id({ args, blockQuery }: NftGetMinterIdOptions): Promise<string | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_get_minter_id',
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

  async get_controller_code_views({ blockQuery }: GetControllerCodeViewsOptions): Promise<ControllerCodeView[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_controller_code_views',
      blockQuery,
    });
  }

  async get_mint_fee({ blockQuery }: GetMintFeeOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_mint_fee',
      blockQuery,
    });
  }

  async get_royalty({ blockQuery }: GetRoyaltyOptions): Promise<number> {
    return this.selector
      .view<RoyaltyView>({
        contractId: this.contractId,
        methodName: 'get_royalty',
        blockQuery,
      })
      .then(({ royalty, divisor }) => royalty / divisor);
  }

  // -------------------------------------------------- Call -------------------------------------------------------

  // signed by registrant
  async nftRegister({ registrantId, args, gas }: NftRegisterOptions) {
    const [mintFee, minterId] = await Promise.all([
      this.get_mint_fee({}),
      this.nft_get_minter_id({ args: { registrant_id: registrantId } }),
    ]);
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'nft_register',
      args,
      attachedDeposit: minterId ? Amount.oneYocto() : mintFee,
      gas,
    });
    await this.selector.sendWithLocalKey(registrantId, transaction);
  }

  async nftUnregister({ args, gas, callbackUrl }: NftUnregisterOptions): Promise<boolean> {
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'nft_unregister',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
    return this.selector.send<boolean>(transaction, { callbackUrl, throwReceiptErrors: true }).then((value) => value!);
  }

  async nftRedeem({ args, gas, callbackUrl }: NftRedeemOptions): Promise<boolean> {
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'nft_redeem',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
    return this.selector.send<boolean>(transaction, { callbackUrl, throwReceiptErrors: true }).then((value) => value!);
  }

  async nftTransfer({ args, gas, callbackUrl }: NftTransferOptions) {
    const transaction = MultiTransaction.batch(this.contractId).nep171.nft_transfer({
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async nftApprove({ args, attachedDeposit, gas, callbackUrl }: NftApproveOptions) {
    const transaction = MultiTransaction.batch(this.contractId).nep171.nft_approve({
      args,
      attachedDeposit: attachedDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async nftRevoke({ args, gas, callbackUrl }: NftRevokeOptions) {
    const transaction = MultiTransaction.batch(this.contractId).nep171.nft_revoke({
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }
}
