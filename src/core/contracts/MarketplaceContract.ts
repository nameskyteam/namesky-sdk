import { Contract } from '../../utils/Contract';
import { DEFAULT_MARKET_STORAGE_DEPOSIT, DEFAULT_APPROVAL_STORAGE_DEPOSIT, FEE_DIVISOR } from '../../utils';
import { AccountView, Approval, ListingView, MarketplaceConfig, OfferingView, TradingFeeRate } from '../types/data';
import {
  AcceptOfferingOptions,
  BuyListingOptions,
  CreateListingOptions,
  CreateMarketAccountOption,
  CreateOfferingOptions,
  GetAccountViewOfOptions,
  GetListingUniqueIdOptions,
  GetListingViewOptions,
  GetListingViewsOfOptions,
  GetListingViewsOptions,
  GetNftApprovalOptions,
  GetNftOfferingViewsOfOptions,
  GetOfferingUniqueIdOptions,
  GetOfferingViewOptions,
  GetOfferingViewsOfOptions,
  GetOfferingViewsOptions,
  GetTradingFeeRateOptions,
  NearDepositOptions,
  NearWithdrawOptions,
  RemoveListingOptions,
  RemoveOfferingOptions,
  UpdateListingOptions,
  UpdateOfferingOptions,
} from '../types/options';
import { UpdateOfferingArgs } from '../types/args';
import { Amount, BigNumber, MultiTransaction, StorageBalance } from 'multi-transaction';

export class MarketplaceContract extends Contract {
  // ------------------------------------------------- View -------------------------------------------------------

  async get_account_view_of({ args, blockQuery }: GetAccountViewOfOptions): Promise<AccountView | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_account_view_of',
      args,
      blockQuery,
    });
  }

  async get_offering_view({ args, blockQuery }: GetOfferingViewOptions): Promise<OfferingView | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_offering_view',
      args,
      blockQuery,
    });
  }

  async get_offering_views({ args, blockQuery }: GetOfferingViewsOptions): Promise<OfferingView[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_offering_views',
      args,
      blockQuery,
    });
  }

  async get_offering_views_of({ args, blockQuery }: GetOfferingViewsOfOptions): Promise<OfferingView[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_offering_views_of',
      args,
      blockQuery,
    });
  }

  async get_nft_offering_views_of({ args, blockQuery }: GetNftOfferingViewsOfOptions): Promise<OfferingView[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_nft_offering_views_of',
      args,
      blockQuery,
    });
  }

  async get_offering_unique_id({ args, blockQuery }: GetOfferingUniqueIdOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_offering_unique_id',
      args,
      blockQuery,
    });
  }

  async get_listing_view({ args, blockQuery }: GetListingViewOptions): Promise<ListingView | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_listing_view',
      args,
      blockQuery,
    });
  }

  async get_listing_views({ args, blockQuery }: GetListingViewsOptions): Promise<ListingView[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_listing_views',
      args,
      blockQuery,
    });
  }

  async get_listing_views_of({ args, blockQuery }: GetListingViewsOfOptions): Promise<ListingView[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_listing_views_of',
      args,
      blockQuery,
    });
  }

  async get_listing_unique_id({ args, blockQuery }: GetListingUniqueIdOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_listing_unique_id',
      args,
      blockQuery,
    });
  }

  async get_nft_approval({ args, blockQuery }: GetNftApprovalOptions): Promise<Approval | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_nft_approval',
      args,
      blockQuery,
    });
  }

  async get_trading_fee_rate({ blockQuery }: GetTradingFeeRateOptions): Promise<TradingFeeRate> {
    const { listing_trading_fee, offering_trading_fee } = await this.selector.view<MarketplaceConfig>({
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
    attachedDeposit,
    gas,
    callbackUrl,
  }: CreateMarketAccountOption): Promise<StorageBalance> {
    const transaction = MultiTransaction.batch(this.contractId).storageManagement.storageDeposit({
      args,
      attachedDeposit: attachedDeposit ?? DEFAULT_MARKET_STORAGE_DEPOSIT,
      gas,
    });

    return this.selector.send(transaction, { callbackUrl });
  }

  async nearDeposit({ args, attachedDeposit, gas, callbackUrl }: NearDepositOptions) {
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'near_deposit',
      args,
      attachedDeposit,
      gas,
    });

    await this.selector.send(transaction, { callbackUrl });
  }

  async nearWithdraw({ args, gas, callbackUrl }: NearWithdrawOptions) {
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'near_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    await this.selector.send(transaction, { callbackUrl });
  }

  async buyListing({ args, attachedDeposit, gas, callbackUrl }: BuyListingOptions): Promise<boolean> {
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'buy_listing',
      args,
      attachedDeposit,
      gas,
    });

    return this.selector.send(transaction, { callbackUrl, throwReceiptErrors: true });
  }

  async createListing({ args, listingStorageDeposit, approvalStorageDeposit, gas, callbackUrl }: CreateListingOptions) {
    const { nft_contract_id, nft_token_id, price, expire_time } = args;
    const transaction = MultiTransaction.batch(this.contractId)
      // first user needs to deposit for storage of new listing
      .storageManagement.storageDeposit({
        attachedDeposit: listingStorageDeposit ?? DEFAULT_MARKET_STORAGE_DEPOSIT,
      });

    // call `nft_approve` to create listing
    transaction.batch(nft_contract_id).nonFungibleToken.nftApprove({
      args: {
        account_id: this.contractId,
        token_id: nft_token_id,
        msg: JSON.stringify({ CreateListing: { price, expire_time } }),
      },
      attachedDeposit: approvalStorageDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      gas,
    });

    await this.selector.send(transaction, { callbackUrl });
  }

  async updateListing({ args, approvalStorageDeposit, gas, callbackUrl }: UpdateListingOptions) {
    const { nft_contract_id, nft_token_id, new_price, new_expire_time } = args;
    // call `nft_approve` to update listing
    const transaction = MultiTransaction.batch(nft_contract_id).nonFungibleToken.nftApprove({
      args: {
        account_id: this.contractId,
        token_id: nft_token_id,
        msg: JSON.stringify({ UpdateListing: { new_price, new_expire_time } }),
      },
      attachedDeposit: approvalStorageDeposit ?? DEFAULT_APPROVAL_STORAGE_DEPOSIT,
      gas,
    });

    await this.selector.send(transaction, { callbackUrl });
  }

  async removeListing({ args, gas, callbackUrl }: RemoveListingOptions): Promise<ListingView> {
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'remove_listing',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    return this.selector.send<ListingView>(transaction, { callbackUrl });
  }

  async acceptOffering({ args, approvalStorageDeposit, gas, callbackUrl }: AcceptOfferingOptions): Promise<boolean> {
    const transaction = MultiTransaction.batch(args.nft_contract_id)
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
        gas,
      });

    return this.selector.send(transaction, { callbackUrl, throwReceiptErrors: true });
  }

  // We have two type of offerings, Simple Offering & Pro Offering
  // If Simple Offering, user needs to deposit with the same price
  // If Pro Offering, we recommend user to deposit insufficient balance
  async createOffering({ args, gas, offeringStorageDeposit, callbackUrl }: CreateOfferingOptions) {
    const transaction = MultiTransaction.batch(this.contractId)
      // first user needs to deposit for storage of new offering
      .storageManagement.storageDeposit({
        attachedDeposit: offeringStorageDeposit ?? DEFAULT_MARKET_STORAGE_DEPOSIT,
      });

    // In case of attached balance not enough, we don't use batch transaction here, we use two separate transactions
    transaction.batch(this.contractId);

    if (args.is_simple_offering) {
      // create new offer and deposit with the same price
      transaction.functionCall({
        methodName: 'create_offering',
        args,
        attachedDeposit: args.price === '0' ? Amount.ONE_YOCTO : args.price,
        gas,
      });
    } else {
      const accountId = this.selector.getActiveAccountId();

      if (!accountId) {
        throw Error(`Active account id not found`);
      }

      const accountView = await this.get_account_view_of({
        args: {
          account_id: accountId,
        },
      });

      const insufficientBalance = BigNumber.max(BigNumber(args.price).minus(accountView?.near_balance ?? 0), 0);

      if (insufficientBalance.gt(0)) {
        // deposit insufficient balance
        transaction.functionCall({
          methodName: 'near_deposit',
          attachedDeposit: insufficientBalance.toFixed(),
        });
      }

      // create new offer
      transaction.functionCall({
        methodName: 'create_offering',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    }

    await this.selector.send(transaction, { callbackUrl });
  }

  // if simple offering, user must make up the insufficient part
  // if pro offering, we recommend user to make up the insufficient part
  async updateOffering({ args, gas, callbackUrl }: UpdateOfferingOptions) {
    const { nft_contract_id, nft_token_id, new_price, new_expire_time } = args;

    if (!new_price && !new_expire_time) {
      throw Error('Must provide `new_price` or `new_expire_time`');
    }

    const transaction = MultiTransaction.batch(this.contractId);

    if (new_price) {
      // if price need to be updated
      const accountId = this.selector.getActiveAccountId();

      if (!accountId) {
        throw Error(`Active account id not found`);
      }

      const offering = await this.get_offering_view({
        args: {
          buyer_id: accountId,
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
        transaction.functionCall<UpdateOfferingArgs>({
          methodName: 'update_offering',
          args,
          attachedDeposit: insufficientBalance.gt(0) ? insufficientBalance.toFixed() : Amount.ONE_YOCTO,
          gas,
        });
      } else {
        // deposit insufficient balance
        if (insufficientBalance.gt(0)) {
          transaction.functionCall({
            methodName: 'near_deposit',
            attachedDeposit: insufficientBalance.toFixed(),
          });
        }

        // update offering
        transaction.functionCall({
          methodName: 'update_offering',
          args,
          attachedDeposit: Amount.ONE_YOCTO,
          gas,
        });
      }
    } else {
      // if price doesn't need to be updated.
      // update offering
      transaction.functionCall({
        methodName: 'update_offering',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    }

    await this.selector.send(transaction, { callbackUrl });
  }

  async removeOffering({ args, gas, callbackUrl }: RemoveOfferingOptions): Promise<OfferingView> {
    const transaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'remove_offering',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

    return this.selector.send(transaction, { callbackUrl });
  }
}
