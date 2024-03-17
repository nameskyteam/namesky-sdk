import { BaseContract } from './BaseContract';
import { DEFAULT_MARKET_STORAGE_DEPOSIT, DEFAULT_APPROVAL_STORAGE_DEPOSIT, FEE_DIVISOR } from '../../utils';
import { AccountView, Approval, ListingView, MarketplaceConfig, OfferingView, TradingFeeRate } from '../types/data';
import {
  AcceptOfferingOptions,
  BuyListingOptions,
  CreateListingOptions,
  CreateMarketAccountOption,
  CreateOfferingOptions,
  NearDepositOptions,
  NearWithdrawOptions,
  RemoveListingOptions,
  RemoveOfferingOptions,
  UpdateListingOptions,
  UpdateOfferingOptions,
} from '../types/call-options';
import {
  GetNftApprovalOptions,
  GetNftOfferingViewsOfOptions,
  GetOfferingUniqueIdOptions,
  GetOfferingViewOptions,
  GetOfferingViewsOfOptions,
  GetOfferingViewsOptions,
  GetTradingFeeRateOptions,
  GetAccountViewOfOptions,
  GetListingUniqueIdOptions,
  GetListingViewOptions,
  GetListingViewsOfOptions,
  GetListingViewsOptions,
} from '../types/view-options';
import { UpdateOfferingArgs } from '../types/args';
import { Amount, BigNumber, Gas, MultiTransaction, StorageBalance } from 'multi-transaction';
import { NameSkySigner } from '../NameSkySigner';

export class MarketplaceContract extends BaseContract {
  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): MarketplaceContract {
    return new MarketplaceContract(this.contractId, signer);
  }

  // ------------------------------------------------- View -------------------------------------------------------

  async getAccountViewOf({ args, blockQuery }: GetAccountViewOfOptions): Promise<AccountView | undefined> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_account_view_of',
      args,
      blockQuery,
    });
  }

  async getOfferingView({ args, blockQuery }: GetOfferingViewOptions): Promise<OfferingView | undefined> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_offering_view',
      args,
      blockQuery,
    });
  }

  async getOfferingViews({ args, blockQuery }: GetOfferingViewsOptions): Promise<OfferingView[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_offering_views',
      args,
      blockQuery,
    });
  }

  async getOfferingViewsOf({ args, blockQuery }: GetOfferingViewsOfOptions): Promise<OfferingView[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_offering_views_of',
      args,
      blockQuery,
    });
  }

  async getNftOfferingViewsOf({ args, blockQuery }: GetNftOfferingViewsOfOptions): Promise<OfferingView[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_nft_offering_views_of',
      args,
      blockQuery,
    });
  }

  async getOfferingUniqueId({ args, blockQuery }: GetOfferingUniqueIdOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_offering_unique_id',
      args,
      blockQuery,
    });
  }

  async getListingView({ args, blockQuery }: GetListingViewOptions): Promise<ListingView | undefined> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_listing_view',
      args,
      blockQuery,
    });
  }

  async getListingViews({ args, blockQuery }: GetListingViewsOptions): Promise<ListingView[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_listing_views',
      args,
      blockQuery,
    });
  }

  async getListingViewsOf({ args, blockQuery }: GetListingViewsOfOptions): Promise<ListingView[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_listing_views_of',
      args,
      blockQuery,
    });
  }

  async getListingUniqueId({ args, blockQuery }: GetListingUniqueIdOptions): Promise<string> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_listing_unique_id',
      args,
      blockQuery,
    });
  }

  async getNftApproval({ args, blockQuery }: GetNftApprovalOptions): Promise<Approval | undefined> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_nft_approval',
      args,
      blockQuery,
    });
  }

  async getTradingFeeRate({ blockQuery }: GetTradingFeeRateOptions): Promise<TradingFeeRate> {
    const { listing_trading_fee, offering_trading_fee } = await this.signer.view<MarketplaceConfig>({
      contractId: this.contractId,
      methodName: 'get_config',
      blockQuery,
    });

    return {
      listing: listing_trading_fee / FEE_DIVISOR,
      offering: offering_trading_fee / FEE_DIVISOR,
    };
  }

  // ------------------------------------------------- Call -------------------------------------------------------
  // This function is wrap of `storage_deposit`, used when a user doesn't
  // create any offering or listing in marketplace, but want to have an account
  async createMarketAccount({
    args,
    marketStorageDeposit,
    gas,
    callbackUrl,
  }: CreateMarketAccountOption): Promise<StorageBalance> {
    const mTx = MultiTransaction.batch(this.contractId).storageManagement.storageDeposit({
      args,
      attachedDeposit: marketStorageDeposit ?? DEFAULT_MARKET_STORAGE_DEPOSIT,
      gas,
    });

    return this.signer.send(mTx, { callbackUrl });
  }

  async nearDeposit({ args, attachedDeposit, gas, callbackUrl }: NearDepositOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'near_deposit',
      args,
      attachedDeposit,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async nearWithdraw({ args, gas, callbackUrl }: NearWithdrawOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'near_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async buyListing({ args, gas, callbackUrl }: BuyListingOptions): Promise<boolean> {
    const listing = await this.getListingView({ args });
    if (!listing) {
      throw Error('Listing not found');
    }

    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'buy_listing',
      args,
      attachedDeposit: listing.price,
      gas: gas ?? Gas.parse(100, 'T'),
    });

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  async createListing({ args, listingStorageDeposit, approvalStorageDeposit, gas, callbackUrl }: CreateListingOptions) {
    const { nft_contract_id, nft_token_id, price, expire_time } = args;
    const mTx = MultiTransaction.batch(this.contractId)
      // first user needs to deposit for storage of new listing
      .storageManagement.storageDeposit({
        attachedDeposit: listingStorageDeposit ?? DEFAULT_MARKET_STORAGE_DEPOSIT,
      });

    // call `nft_approve` to create listing
    mTx.batch(nft_contract_id).nonFungibleToken.nftApprove({
      args: {
        account_id: this.contractId,
        token_id: nft_token_id,
        msg: JSON.stringify({ CreateListing: { price, expire_time } }),
      },
      attachedDeposit: approvalStorageDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async updateListing({ args, approvalStorageDeposit, gas, callbackUrl }: UpdateListingOptions) {
    const { nft_contract_id, nft_token_id, new_price, new_expire_time } = args;
    // call `nft_approve` to update listing
    const mTx = MultiTransaction.batch(nft_contract_id).nonFungibleToken.nftApprove({
      args: {
        account_id: this.contractId,
        token_id: nft_token_id,
        msg: JSON.stringify({ UpdateListing: { new_price, new_expire_time } }),
      },
      attachedDeposit: approvalStorageDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async removeListing({ args, gas, callbackUrl }: RemoveListingOptions): Promise<ListingView> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'remove_listing',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    return this.signer.send<ListingView>(mTx, { callbackUrl });
  }

  async acceptOffering({ args, approvalStorageDeposit, gas, callbackUrl }: AcceptOfferingOptions): Promise<boolean> {
    const mTx = MultiTransaction.batch(args.nft_contract_id)
      .nonFungibleToken.nftApprove({
        args: {
          token_id: args.nft_token_id,
          account_id: this.contractId,
          msg: '',
        },
        attachedDeposit: approvalStorageDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      })
      .batch(this.contractId)
      .functionCall({
        methodName: 'accept_offering',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas: gas ?? Gas.parse(100, 'T'),
      });

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  // We have two type of offerings, Simple Offering & Pro Offering
  // If Simple Offering, user needs to deposit with the same price
  // If Pro Offering, we recommend user to deposit insufficient balance
  async createOffering({ args, gas, offeringStorageDeposit, callbackUrl }: CreateOfferingOptions) {
    const mTx = MultiTransaction.batch(this.contractId)
      // first user needs to deposit for storage of new offering
      .storageManagement.storageDeposit({
        attachedDeposit: offeringStorageDeposit ?? DEFAULT_MARKET_STORAGE_DEPOSIT,
      });

    // In case of attached balance not enough, we don't use batch transaction here, we use two separate transactions
    mTx.batch(this.contractId);

    args.is_simple_offering = args.is_simple_offering ?? true;

    if (args.is_simple_offering) {
      // create new offer and deposit with the same price
      mTx.functionCall({
        methodName: 'create_offering',
        args,
        attachedDeposit: args.price === '0' ? Amount.ONE_YOCTO : args.price,
        gas,
      });
    } else {
      const accountView = await this.getAccountViewOf({
        args: {
          account_id: this.signer.accountId,
        },
      });

      const insufficientBalance = BigNumber.max(BigNumber(args.price).minus(accountView?.near_balance ?? 0), 0);

      if (insufficientBalance.gt(0)) {
        // deposit insufficient balance
        mTx.functionCall({
          methodName: 'near_deposit',
          attachedDeposit: insufficientBalance.toFixed(),
        });
      }

      // create new offer
      mTx.functionCall({
        methodName: 'create_offering',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    }

    await this.signer.send(mTx, { callbackUrl });
  }

  // if simple offering, user must make up the insufficient part
  // if pro offering, we recommend user to make up the insufficient part
  async updateOffering({ args, gas, callbackUrl }: UpdateOfferingOptions) {
    const { nft_contract_id, nft_token_id, new_price, new_expire_time } = args;

    if (!new_price && !new_expire_time) {
      throw Error('Must provide `new_price` or `new_expire_time`');
    }

    const mTx = MultiTransaction.batch(this.contractId);

    if (new_price) {
      // if price need to be updated

      const offering = await this.getOfferingView({
        args: {
          buyer_id: this.signer.accountId,
          nft_contract_id,
          nft_token_id,
        },
      });

      if (!offering) {
        throw Error('Offering not found');
      }

      const insufficientBalance = BigNumber.max(BigNumber(new_price).minus(offering.price), 0);

      if (offering.is_simple_offering) {
        // update offering and deposit insufficient balance
        mTx.functionCall<UpdateOfferingArgs>({
          methodName: 'update_offering',
          args,
          attachedDeposit: insufficientBalance.gt(0) ? insufficientBalance.toFixed() : Amount.ONE_YOCTO,
          gas,
        });
      } else {
        // deposit insufficient balance
        if (insufficientBalance.gt(0)) {
          mTx.functionCall({
            methodName: 'near_deposit',
            attachedDeposit: insufficientBalance.toFixed(),
          });
        }

        // update offering
        mTx.functionCall({
          methodName: 'update_offering',
          args,
          attachedDeposit: Amount.ONE_YOCTO,
          gas,
        });
      }
    } else {
      // if price doesn't need to be updated.
      // update offering
      mTx.functionCall({
        methodName: 'update_offering',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    }

    await this.signer.send(mTx, { callbackUrl });
  }

  async removeOffering({ args, gas, callbackUrl }: RemoveOfferingOptions): Promise<OfferingView> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'remove_offering',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    return this.signer.send(mTx, { callbackUrl });
  }
}
