import { BaseContract } from './BaseContract';
import { DEFAULT_APPROVAL_STORAGE_DEPOSIT } from '../../utils';
import { Amount, MultiTransaction } from 'multi-transaction';
import {
  NftApproveOptions,
  NftRedeemOptions,
  NftRevokeOptions,
  NftTransferOptions,
  NftUnregisterOptions,
} from '../types/change-options';
import {
  GetControllerCodeViewsOptions,
  GetLatestControllerCodeHashOptions,
  GetLatestControllerCodeOptions,
  GetMintFeeOptions,
  GetMintNumOptions,
  GetRoyaltyOptions,
  NftRegistrantIdsOfOptions,
  NftGetMinterIdOptions,
  NftNameSkyTokenOptions,
  NftNameSkyTokensForOwnerOptions,
  NftNameSkyTokensOptions,
  NftStateOptions,
  NftSupplyForOwnerOptions,
  NftTotalSupplyOptions,
} from '../types/view-options';
import { ControllerCodeView, NameSkyToken, RoyaltyView, TokenState } from '../types/data';
import { NameSkySigner } from '../NameSkySigner';

export class CoreContract extends BaseContract {
  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): CoreContract {
    return new CoreContract(this.contractId, signer);
  }

  // ------------------------------------------------- View -------------------------------------------------------

  async nftGetMinterId({ args, blockQuery }: NftGetMinterIdOptions): Promise<string | undefined> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_get_minter_id',
      args,
      blockQuery,
    });
  }

  async nftRegistrantIdsOf({ args, blockQuery }: NftRegistrantIdsOfOptions): Promise<string[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_registrant_ids_of',
      args,
      blockQuery,
    });
  }

  async nftState({ args, blockQuery }: NftStateOptions): Promise<TokenState | undefined> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_state',
      args,
      blockQuery,
    });
  }

  async nftNameSkyToken({ args, blockQuery }: NftNameSkyTokenOptions): Promise<NameSkyToken | undefined> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_namesky_token',
      args,
      blockQuery,
    });
  }

  async nftNameSkyTokens({ args, blockQuery }: NftNameSkyTokensOptions): Promise<NameSkyToken[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens',
      args,
      blockQuery,
    });
  }

  async nftNameSkyTokensForOwner({ args, blockQuery }: NftNameSkyTokensForOwnerOptions): Promise<NameSkyToken[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens_for_owner',
      args,
      blockQuery,
    });
  }

  async nftSupplyForOwner({ args, blockQuery }: NftSupplyForOwnerOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_supply_for_owner',
      args,
      blockQuery,
    });
  }

  async nftTotalSupply({ blockQuery }: NftTotalSupplyOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'nft_total_supply',
      blockQuery,
    });
  }

  async getLatestControllerCode({ blockQuery }: GetLatestControllerCodeOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code',
      blockQuery,
    });
  }

  async getLatestControllerCodeHash({ blockQuery }: GetLatestControllerCodeHashOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code_hash',
      blockQuery,
    });
  }

  async getControllerCodeViews({ blockQuery }: GetControllerCodeViewsOptions): Promise<ControllerCodeView[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_controller_code_views',
      blockQuery,
    });
  }

  async getMintFee({ blockQuery }: GetMintFeeOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_mint_fee',
      blockQuery,
    });
  }

  async getRoyalty({ blockQuery }: GetRoyaltyOptions): Promise<number> {
    const { royalty, divisor } = await this.signer.view<RoyaltyView>({
      contractId: this.contractId,
      methodName: 'get_royalty',
      blockQuery,
    });

    return royalty / divisor;
  }

  async getMintNum({ args, blockQuery }: GetMintNumOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_mint_num',
      args,
      blockQuery,
    });
  }

  // -------------------------------------------------- Call -------------------------------------------------------

  async nftUnregister({ args, gas, callbackUrl }: NftUnregisterOptions): Promise<boolean> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'nft_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  async nftRedeem({ args, gas, callbackUrl }: NftRedeemOptions): Promise<boolean> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'nft_redeem',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  async nftTransfer({ args, gas, callbackUrl }: NftTransferOptions) {
    const mTx = MultiTransaction.batch(this.contractId).nonFungibleToken.nft_transfer({
      args,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async nftApprove({ args, approvalStorageDeposit, gas, callbackUrl }: NftApproveOptions) {
    const mTx = MultiTransaction.batch(this.contractId).nonFungibleToken.nft_approve({
      args,
      attachedDeposit: approvalStorageDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async nftRevoke({ args, gas, callbackUrl }: NftRevokeOptions) {
    const mTx = MultiTransaction.batch(this.contractId).nonFungibleToken.nft_revoke({
      args,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }
}
