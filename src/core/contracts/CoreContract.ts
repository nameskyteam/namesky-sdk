import { BaseContract, BaseContractOptions } from './BaseContract';
import { Amount, Gas, MultiTransaction } from 'multi-transaction';
import {
  NftApproveOptions,
  NftMintOptions,
  NftRedeemOptions,
  NftRevokeOptions,
  NftTransferOptions,
  NftUnregisterOptions,
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
  NftRegistrantIdsOptions,
  ControllerCodeView,
  NameSkyToken,
  RoyaltyView,
  TokenState,
  GetMintNumArgs,
  NftGetMinterIdArgs,
  NftMintArgs,
  NftNameSkyTokenArgs,
  NftNameSkyTokensArgs,
  NftNameSkyTokensForOwnerArgs,
  NftRedeemArgs,
  NftRegistrantIdsArgs,
  NftRegistrantIdsOfArgs,
  NftStateArgs,
  NftUnregisterArgs,
} from '../../types';
import { NameSkySigner } from '../NameSkySigner';
import { NftSupplyForOwnerArgs } from 'multi-transaction';

export type CoreContractOptions = BaseContractOptions;

export class CoreContract extends BaseContract {
  constructor(options: CoreContractOptions) {
    super(options);
  }

  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): CoreContract {
    return new CoreContract({
      contractId: this.contractId,
      signer,
    });
  }

  // ------------------------------------------------- View -------------------------------------------------------

  async nftGetMinterId(options: NftGetMinterIdOptions): Promise<string | undefined> {
    const { registrantId, blockQuery } = options;
    return this.signer.view<string | undefined, NftGetMinterIdArgs>({
      contractId: this.contractId,
      methodName: 'nft_get_minter_id',
      args: {
        registrant_id: registrantId,
      },
      blockQuery,
    });
  }

  async nftRegistrantIdsOf(options: NftRegistrantIdsOfOptions): Promise<string[]> {
    const { minterId, fromIndex, limit, blockQuery } = options;
    return this.signer.view<string[], NftRegistrantIdsOfArgs>({
      contractId: this.contractId,
      methodName: 'nft_registrant_ids_of',
      args: {
        minter_id: minterId,
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftRegistrantIds(options: NftRegistrantIdsOptions = {}): Promise<string[]> {
    const { fromIndex, limit, blockQuery } = options;
    return this.signer.view<string[], NftRegistrantIdsArgs>({
      contractId: this.contractId,
      methodName: 'nft_registrant_ids',
      args: {
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftState(options: NftStateOptions): Promise<TokenState | undefined> {
    const { tokenId, blockQuery } = options;
    return this.signer.view<TokenState | undefined, NftStateArgs>({
      contractId: this.contractId,
      methodName: 'nft_state',
      args: {
        token_id: tokenId,
      },
      blockQuery,
    });
  }

  async nftNameSkyToken(options: NftNameSkyTokenOptions): Promise<NameSkyToken | undefined> {
    const { tokenId, blockQuery } = options;
    return this.signer.view<NameSkyToken | undefined, NftNameSkyTokenArgs>({
      contractId: this.contractId,
      methodName: 'nft_namesky_token',
      args: {
        token_id: tokenId,
      },
      blockQuery,
    });
  }

  async nftNameSkyTokens(options: NftNameSkyTokensOptions = {}): Promise<NameSkyToken[]> {
    const { fromIndex, limit, blockQuery } = options;
    return this.signer.view<NameSkyToken[], NftNameSkyTokensArgs>({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens',
      args: {
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftNameSkyTokensForOwner(options: NftNameSkyTokensForOwnerOptions): Promise<NameSkyToken[]> {
    const { accountId, fromIndex, limit, blockQuery } = options;
    return this.signer.view<NameSkyToken[], NftNameSkyTokensForOwnerArgs>({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens_for_owner',
      args: {
        account_id: accountId,
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftSupplyForOwner(options: NftSupplyForOwnerOptions): Promise<string> {
    const { accountId, blockQuery } = options;
    return this.signer.view<string, NftSupplyForOwnerArgs>({
      contractId: this.contractId,
      methodName: 'nft_supply_for_owner',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async nftTotalSupply(options: NftTotalSupplyOptions = {}): Promise<string> {
    const { blockQuery } = options;
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'nft_total_supply',
      blockQuery,
    });
  }

  async getLatestControllerCode(options: GetLatestControllerCodeOptions = {}): Promise<string> {
    const { blockQuery } = options;
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code',
      blockQuery,
    });
  }

  async getLatestControllerCodeHash(options: GetLatestControllerCodeHashOptions = {}): Promise<string> {
    const { blockQuery } = options;
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code_hash',
      blockQuery,
    });
  }

  async getControllerCodeViews(options: GetControllerCodeViewsOptions = {}): Promise<ControllerCodeView[]> {
    const { blockQuery } = options;
    return this.signer.view<ControllerCodeView[]>({
      contractId: this.contractId,
      methodName: 'get_controller_code_views',
      blockQuery,
    });
  }

  async getMintFee(options: GetMintFeeOptions = {}): Promise<string> {
    const { blockQuery } = options;
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_mint_fee',
      blockQuery,
    });
  }

  async getRoyalty(options: GetRoyaltyOptions = {}): Promise<number> {
    const { blockQuery } = options;
    const { royalty, divisor } = await this.signer.view<RoyaltyView>({
      contractId: this.contractId,
      methodName: 'get_royalty',
      blockQuery,
    });

    return royalty / divisor;
  }

  async getMintNum(options: GetMintNumOptions): Promise<string> {
    const { accountId, blockQuery } = options;
    return this.signer.view<string, GetMintNumArgs>({
      contractId: this.contractId,
      methodName: 'get_mint_num',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  // -------------------------------------------------- Change -----------------------------------------------------

  /**
   * Mint is ONLY available for operator account
   */
  async nftMint(options: NftMintOptions): Promise<boolean> {
    const { tokenId, metadata, controllerCodeHash } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<NftMintArgs>({
      methodName: 'nft_mint',
      args: {
        token_id: tokenId,
        metadata,
        controller_code_hash: controllerCodeHash,
      },
      gas: Gas.parse(100, 'T'),
    });

    return this.signer.send(mTransaction, { throwReceiptErrors: true });
  }

  async nftUnregister(options: NftUnregisterOptions): Promise<boolean> {
    const { registrantId, publicKey, force, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<NftUnregisterArgs>({
      methodName: 'nft_unregister',
      args: {
        registrant_id: registrantId,
        public_key: publicKey,
        force,
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(100, 'T'),
    });

    return this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }

  async nftRedeem(options: NftRedeemOptions): Promise<boolean> {
    const { tokenId, publicKey, force, memo, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<NftRedeemArgs>({
      methodName: 'nft_redeem',
      args: {
        token_id: tokenId,
        public_key: publicKey,
        force,
        memo,
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(100, 'T'),
    });

    return this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }

  async nftTransfer(options: NftTransferOptions) {
    const { tokenId, receiverId, approvalId, memo, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).nft.transfer({
      args: {
        token_id: tokenId,
        receiver_id: receiverId,
        approval_id: approvalId,
        memo,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async nftApprove(options: NftApproveOptions) {
    const { tokenId, accountId, msg, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).nft.approve({
      args: {
        token_id: tokenId,
        account_id: accountId,
        msg,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async nftRevoke(options: NftRevokeOptions) {
    const { tokenId, accountId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).nft.revoke({
      args: {
        token_id: tokenId,
        account_id: accountId,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }
}
