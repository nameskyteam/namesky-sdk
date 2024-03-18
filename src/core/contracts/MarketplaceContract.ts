import { BaseContract, BaseContractOptions } from './BaseContract';
import { calcInsufficientBalance, DEFAULT_MARKET_STORAGE_DEPOSIT, FEE_DIVISOR, jsonSerialize } from '../../utils';
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
} from '../types/change-options';
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
import {
  BuyListingArgs,
  CreateListingArgs,
  GetAccountViewOfArgs,
  GetListingUniqueIdArgs,
  GetListingViewArgs,
  GetListingViewsArgs,
  GetListingViewsOfArgs,
  GetNftApprovalArgs,
  GetNftOfferingViewsOfArgs,
  GetOfferingUniqueIdArgs,
  GetOfferingViewArgs,
  GetOfferingViewsArgs,
  GetOfferingViewsOfArgs,
  NearWithdrawArgs,
  RemoveListingArgs,
  UpdateListingArgs,
  UpdateOfferingArgs,
} from '../types/args';
import { Amount, BigNumber, Gas, MultiTransaction, StorageBalance, Stringifier } from 'multi-transaction';
import { NameSkySigner } from '../NameSkySigner';

export type MarketplaceContractOptions = BaseContractOptions & {
  coreContractId: string;
};

export class MarketplaceContract extends BaseContract {
  coreContractId: string;

  constructor({ coreContractId, ...options }: MarketplaceContractOptions) {
    super(options);
    this.coreContractId = coreContractId;
  }

  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): MarketplaceContract {
    return new MarketplaceContract({
      coreContractId: this.coreContractId,
      contractId: this.contractId,
      signer,
    });
  }

  // ------------------------------------------------- View -------------------------------------------------------

  async getAccountViewOf({ accountId, blockQuery }: GetAccountViewOfOptions): Promise<AccountView | undefined> {
    return this.signer.view<AccountView | undefined, GetAccountViewOfArgs>({
      contractId: this.contractId,
      methodName: 'get_account_view_of',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getOfferingView({ tokenId, buyerId, blockQuery }: GetOfferingViewOptions): Promise<OfferingView | undefined> {
    return this.signer.view<OfferingView | undefined, GetOfferingViewArgs>({
      contractId: this.contractId,
      methodName: 'get_offering_view',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
        buyer_id: buyerId,
      },
      blockQuery,
    });
  }

  async getOfferingViews({ offset, limit, blockQuery }: GetOfferingViewsOptions): Promise<OfferingView[]> {
    return this.signer.view<OfferingView[], GetOfferingViewsArgs>({
      contractId: this.contractId,
      methodName: 'get_offering_views',
      args: {
        offset,
        limit,
      },
      blockQuery,
    });
  }

  async getOfferingViewsOf({
    accountId,
    offset,
    limit,
    blockQuery,
  }: GetOfferingViewsOfOptions): Promise<OfferingView[]> {
    return this.signer.view<OfferingView[], GetOfferingViewsOfArgs>({
      contractId: this.contractId,
      methodName: 'get_offering_views_of',
      args: {
        account_id: accountId,
        offset,
        limit,
      },
      blockQuery,
    });
  }

  async getNftOfferingViewsOf({
    tokenId,
    offset,
    limit,
    blockQuery,
  }: GetNftOfferingViewsOfOptions): Promise<OfferingView[]> {
    return this.signer.view<OfferingView[], GetNftOfferingViewsOfArgs>({
      contractId: this.contractId,
      methodName: 'get_nft_offering_views_of',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
        offset,
        limit,
      },
      blockQuery,
    });
  }

  async getOfferingUniqueId({ tokenId, buyerId, blockQuery }: GetOfferingUniqueIdOptions): Promise<string> {
    return this.signer.view<string, GetOfferingUniqueIdArgs>({
      contractId: this.contractId,
      methodName: 'get_offering_unique_id',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
        buyer_id: buyerId,
      },
      blockQuery,
    });
  }

  async getListingView({ tokenId, blockQuery }: GetListingViewOptions): Promise<ListingView | undefined> {
    return this.signer.view<ListingView | undefined, GetListingViewArgs>({
      contractId: this.contractId,
      methodName: 'get_listing_view',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
      blockQuery,
    });
  }

  async getListingViews({ offset, limit, blockQuery }: GetListingViewsOptions): Promise<ListingView[]> {
    return this.signer.view<ListingView[], GetListingViewsArgs>({
      contractId: this.contractId,
      methodName: 'get_listing_views',
      args: {
        offset,
        limit,
      },
      blockQuery,
    });
  }

  async getListingViewsOf({ accountId, offset, limit, blockQuery }: GetListingViewsOfOptions): Promise<ListingView[]> {
    return this.signer.view<ListingView[], GetListingViewsOfArgs>({
      contractId: this.contractId,
      methodName: 'get_listing_views_of',
      args: {
        account_id: accountId,
        offset,
        limit,
      },
      blockQuery,
    });
  }

  async getListingUniqueId({ tokenId, blockQuery }: GetListingUniqueIdOptions): Promise<string> {
    return this.signer.view<string, GetListingUniqueIdArgs>({
      contractId: this.contractId,
      methodName: 'get_listing_unique_id',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
      blockQuery,
    });
  }

  async getNftApproval({ tokenId, blockQuery }: GetNftApprovalOptions): Promise<Approval | undefined> {
    return this.signer.view<Approval | undefined, GetNftApprovalArgs>({
      contractId: this.contractId,
      methodName: 'get_nft_approval',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
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

  // ------------------------------------------------- Change -----------------------------------------------------

  // This function is wrap of `storage_deposit`, used when a user doesn't
  // create any offering or listing in marketplace, but want to have an account
  async createMarketAccount({ callbackUrl }: CreateMarketAccountOption): Promise<StorageBalance> {
    const mTx = MultiTransaction.batch(this.contractId).storageManagement.storage_deposit({
      attachedDeposit: DEFAULT_MARKET_STORAGE_DEPOSIT,
    });

    return this.signer.send(mTx, { callbackUrl });
  }

  async nearDeposit({ amount, callbackUrl }: NearDepositOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'near_deposit',
      attachedDeposit: amount,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async nearWithdraw({ amount, callbackUrl }: NearWithdrawOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<NearWithdrawArgs>({
      methodName: 'near_withdraw',
      args: {
        amount,
      },
      attachedDeposit: Amount.ONE_YOCTO,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async buyListing({ tokenId, callbackUrl }: BuyListingOptions): Promise<boolean> {
    const listing = await this.getListingView({ tokenId });
    if (!listing) {
      throw Error('Listing not found');
    }

    const mTx = MultiTransaction.batch(this.contractId).functionCall<BuyListingArgs>({
      methodName: 'buy_listing',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
      attachedDeposit: listing.price,
      gas: Gas.parse(100, 'T'),
    });

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  async createListing({ tokenId, price, expireTime, callbackUrl }: CreateListingOptions) {
    const mTx = MultiTransaction.batch(this.contractId)
      // first user needs to deposit storage fee for new listing
      .storageManagement.storage_deposit({
        attachedDeposit: DEFAULT_MARKET_STORAGE_DEPOSIT,
      });

    // call `nft_approve` to create listing
    mTx.batch(this.coreContractId).nonFungibleToken.nft_approve({
      args: {
        account_id: this.contractId,
        token_id: tokenId,
        msg: jsonSerialize<CreateListingArgs>({ CreateListing: { price, expire_time: expireTime } }),
      },
      gas: Gas.parse(50, 'T'),
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async updateListing({ tokenId, newPrice, newExpireTime, callbackUrl }: UpdateListingOptions) {
    // call `nft_approve` to update listing
    const mTx = MultiTransaction.batch(this.coreContractId).nonFungibleToken.nft_approve({
      args: {
        account_id: this.contractId,
        token_id: tokenId,
        msg: jsonSerialize<UpdateListingArgs>({
          UpdateListing: { new_price: newPrice, new_expire_time: newExpireTime },
        }),
      },
      gas: Gas.parse(50, 'T'),
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async removeListing({ tokenId, callbackUrl }: RemoveListingOptions): Promise<ListingView> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<RemoveListingArgs>({
      methodName: 'remove_listing',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
      attachedDeposit: Amount.ONE_YOCTO,
    });

    return this.signer.send<ListingView>(mTx, { callbackUrl });
  }

  async acceptOffering({ args, approvalStorageDeposit, gas, callbackUrl }: AcceptOfferingOptions): Promise<boolean> {
    const mTx = MultiTransaction.batch(args.nft_contract_id)
      .nonFungibleToken.nft_approve({
        args: {
          token_id: args.nft_token_id,
          account_id: this.contractId,
          msg: '',
        },
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
      .storageManagement.storage_deposit({
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
        accountId: this.signer.accountId,
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
  async updateOffering({ tokenId, newPrice, newExpireTime, callbackUrl }: UpdateOfferingOptions) {
    if (!newPrice && !newExpireTime) {
      throw Error('Must provide `newPrice` or `newExpireTime`');
    }

    const offering = await this.getOfferingView({
      tokenId,
      buyerId: this.signer.accountId,
    });

    if (!offering) {
      throw Error('Offering not found');
    }

    const mTx = MultiTransaction.batch(this.contractId);

    if (newPrice) {
      const insufficientBalance = calcInsufficientBalance(offering.price, newPrice);

      if (offering.is_simple_offering) {
        // update offering and deposit insufficient balance
        mTx.functionCall<UpdateOfferingArgs>({
          methodName: 'update_offering',
          args: {
            nft_contract_id: this.coreContractId,
            nft_token_id: tokenId,
            new_price: newPrice,
            new_expire_time: newExpireTime,
          },
          attachedDeposit: insufficientBalance.gt(0) ? insufficientBalance.toFixed() : Amount.ONE_YOCTO,
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
          args: {
            nft_contract_id: this.coreContractId,
            nft_token_id: tokenId,
            new_price: newPrice,
            new_expire_time: newExpireTime,
          },
          attachedDeposit: Amount.ONE_YOCTO,
        });
      }
    } else {
      mTx.functionCall({
        methodName: 'update_offering',
        args: {
          nft_contract_id: this.coreContractId,
          nft_token_id: tokenId,
          new_price: newPrice,
          new_expire_time: newExpireTime,
        },
        attachedDeposit: Amount.ONE_YOCTO,
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
