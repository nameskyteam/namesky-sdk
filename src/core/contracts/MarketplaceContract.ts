import { BaseContract, BaseContractOptions } from './BaseContract';
import { jsonSerialize } from '../../utils';
import {
  AccountView,
  Approval,
  ListingView,
  MarketplaceConfig,
  OfferingView,
  TradingFeeRate,
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
  AcceptOfferingArgs,
  BuyListingArgs,
  CreateOfferingArgs,
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
  RemoveOfferingArgs,
  UpdateOfferingArgs,
  NonFungibleTokenReceiverMsg,
} from '../types';
import { Amount, Gas, MultiTransaction, StorageBalance } from 'multi-transaction';
import { NameSkySigner } from '../NameSkySigner';
import { DEFAULT_MARKET_STORAGE_DEPOSIT, FEE_DIVISOR } from '../../utils/constants';
import { calcInsufficientBalance } from '../../utils/internal';

export type MarketplaceContractOptions = BaseContractOptions & {
  coreContractId: string;
};

export class MarketplaceContract extends BaseContract {
  private readonly coreContractId: string;

  constructor(options: MarketplaceContractOptions) {
    const { coreContractId, ...baseOptions } = options;
    super(baseOptions);
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

  async getAccountViewOf(options: GetAccountViewOfOptions): Promise<AccountView | undefined> {
    const { accountId, blockQuery } = options;
    return this.signer.view<AccountView | undefined, GetAccountViewOfArgs>({
      contractId: this.contractId,
      methodName: 'get_account_view_of',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getOfferingView(options: GetOfferingViewOptions): Promise<OfferingView | undefined> {
    const { tokenId, buyerId, blockQuery } = options;
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

  async getOfferingViews(options: GetOfferingViewsOptions = {}): Promise<OfferingView[]> {
    const { offset, limit, blockQuery } = options;
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

  async getOfferingViewsOf(options: GetOfferingViewsOfOptions): Promise<OfferingView[]> {
    const { accountId, offset, limit, blockQuery } = options;
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

  async getNftOfferingViewsOf(options: GetNftOfferingViewsOfOptions): Promise<OfferingView[]> {
    const { tokenId, offset, limit, blockQuery } = options;
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

  async getOfferingUniqueId(options: GetOfferingUniqueIdOptions): Promise<string> {
    const { tokenId, buyerId, blockQuery } = options;
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

  async getListingView(options: GetListingViewOptions): Promise<ListingView | undefined> {
    const { tokenId, blockQuery } = options;
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

  async getListingViews(options: GetListingViewsOptions = {}): Promise<ListingView[]> {
    const { offset, limit, blockQuery } = options;
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

  async getListingViewsOf(options: GetListingViewsOfOptions): Promise<ListingView[]> {
    const { accountId, offset, limit, blockQuery } = options;
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

  async getListingUniqueId(options: GetListingUniqueIdOptions): Promise<string> {
    const { tokenId, blockQuery } = options;
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

  async getNftApproval(options: GetNftApprovalOptions): Promise<Approval | undefined> {
    const { tokenId, blockQuery } = options;
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

  async getTradingFeeRate(options: GetTradingFeeRateOptions = {}): Promise<TradingFeeRate> {
    const { blockQuery } = options;
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

  async createMarketAccount(options: CreateMarketAccountOption = {}): Promise<StorageBalance> {
    const { callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).storage.deposit({
      attachedDeposit: DEFAULT_MARKET_STORAGE_DEPOSIT,
    });

    return this.signer.send(mTransaction, { callbackUrl });
  }

  async nearDeposit(options: NearDepositOptions) {
    const { amount, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'near_deposit',
      attachedDeposit: amount,
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async nearWithdraw(options: NearWithdrawOptions = {}) {
    const { amount, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<NearWithdrawArgs>({
      methodName: 'near_withdraw',
      args: {
        amount,
      },
      attachedDeposit: Amount.ONE_YOCTO,
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async buyListing(options: BuyListingOptions): Promise<boolean> {
    const { tokenId, callbackUrl } = options;
    const listing = await this.getListingView({ tokenId });
    if (!listing) {
      throw Error('Listing not found');
    }

    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<BuyListingArgs>({
      methodName: 'buy_listing',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
      attachedDeposit: listing.price,
      gas: Gas.parse(100, 'T'),
    });

    return this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }

  async createListing(options: CreateListingOptions) {
    const { tokenId, price, expireTime, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId)
      // first user needs to deposit storage fee for new listing
      .storage.deposit({
        attachedDeposit: DEFAULT_MARKET_STORAGE_DEPOSIT,
      })
      .batch(this.coreContractId)
      .nft.approve({
        args: {
          account_id: this.contractId,
          token_id: tokenId,
          msg: jsonSerialize<NonFungibleTokenReceiverMsg>({ CreateListing: { price, expire_time: expireTime } }),
        },
        gas: Gas.parse(50, 'T'),
      });

    await this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }

  async updateListing(options: UpdateListingOptions) {
    const { tokenId, newPrice, newExpireTime, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.coreContractId).nft.approve({
      args: {
        account_id: this.contractId,
        token_id: tokenId,
        msg: jsonSerialize<NonFungibleTokenReceiverMsg>({
          UpdateListing: { new_price: newPrice, new_expire_time: newExpireTime },
        }),
      },
      gas: Gas.parse(50, 'T'),
    });

    await this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }

  async removeListing(options: RemoveListingOptions): Promise<ListingView> {
    const { tokenId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<RemoveListingArgs>({
      methodName: 'remove_listing',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(50, 'T'),
    });

    return this.signer.send<ListingView>(mTransaction, { callbackUrl });
  }

  async acceptOffering(options: AcceptOfferingOptions): Promise<boolean> {
    const { tokenId, buyerId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.coreContractId)
      .nft.approve({
        args: {
          token_id: tokenId,
          account_id: this.contractId,
          msg: '',
        },
        gas: Gas.parse(50, 'T'),
      })
      .batch(this.contractId)
      .functionCall<AcceptOfferingArgs>({
        methodName: 'accept_offering',
        args: {
          nft_contract_id: this.coreContractId,
          nft_token_id: tokenId,
          buyer_id: buyerId,
        },
        attachedDeposit: Amount.ONE_YOCTO,
        gas: Gas.parse(100, 'T'),
      });

    return this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }

  async createOffering(options: CreateOfferingOptions) {
    const { tokenId, price, expireTime, isSimpleOffering = true, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId)
      // first user needs to deposit storage fee for new offering
      .storage.deposit({
        attachedDeposit: DEFAULT_MARKET_STORAGE_DEPOSIT,
      });

    if (isSimpleOffering) {
      // create new offering and deposit with the same price
      mTransaction.functionCall<CreateOfferingArgs>({
        methodName: 'create_offering',
        args: {
          nft_contract_id: this.coreContractId,
          nft_token_id: tokenId,
          price,
          expire_time: expireTime,
          is_simple_offering: isSimpleOffering,
        },
        attachedDeposit: price === '0' ? Amount.ONE_YOCTO : price,
        gas: Gas.parse(50, 'T'),
      });
    } else {
      const accountView = await this.getAccountViewOf({
        accountId: this.signer.accountId,
      });

      const insufficientBalance = calcInsufficientBalance(accountView?.near_balance ?? 0, price);

      if (insufficientBalance.gt(0)) {
        // deposit insufficient balance
        mTransaction.functionCall({
          methodName: 'near_deposit',
          attachedDeposit: insufficientBalance.toFixed(),
        });
      }

      // create new offering
      mTransaction.functionCall<CreateOfferingArgs>({
        methodName: 'create_offering',
        args: {
          nft_contract_id: this.coreContractId,
          nft_token_id: tokenId,
          price,
          expire_time: expireTime,
          is_simple_offering: isSimpleOffering,
        },
        attachedDeposit: Amount.ONE_YOCTO,
        gas: Gas.parse(50, 'T'),
      });
    }

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async updateOffering(options: UpdateOfferingOptions) {
    const { tokenId, newPrice, newExpireTime, callbackUrl } = options;
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

    const mTransaction = MultiTransaction.batch(this.contractId);

    if (newPrice) {
      const insufficientBalance = calcInsufficientBalance(offering.price, newPrice);

      if (offering.is_simple_offering) {
        // update offering and deposit insufficient balance
        mTransaction.functionCall<UpdateOfferingArgs>({
          methodName: 'update_offering',
          args: {
            nft_contract_id: this.coreContractId,
            nft_token_id: tokenId,
            new_price: newPrice,
            new_expire_time: newExpireTime,
          },
          attachedDeposit: insufficientBalance.gt(0) ? insufficientBalance.toFixed() : Amount.ONE_YOCTO,
          gas: Gas.parse(50, 'T'),
        });
      } else {
        // deposit insufficient balance
        if (insufficientBalance.gt(0)) {
          mTransaction.functionCall({
            methodName: 'near_deposit',
            attachedDeposit: insufficientBalance.toFixed(),
          });
        }

        // update offering
        mTransaction.functionCall<UpdateOfferingArgs>({
          methodName: 'update_offering',
          args: {
            nft_contract_id: this.coreContractId,
            nft_token_id: tokenId,
            new_price: newPrice,
            new_expire_time: newExpireTime,
          },
          attachedDeposit: Amount.ONE_YOCTO,
          gas: Gas.parse(50, 'T'),
        });
      }
    } else {
      mTransaction.functionCall<UpdateOfferingArgs>({
        methodName: 'update_offering',
        args: {
          nft_contract_id: this.coreContractId,
          nft_token_id: tokenId,
          new_price: newPrice,
          new_expire_time: newExpireTime,
        },
        attachedDeposit: Amount.ONE_YOCTO,
        gas: Gas.parse(50, 'T'),
      });
    }

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async removeOffering(options: RemoveOfferingOptions): Promise<OfferingView> {
    const { tokenId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<RemoveOfferingArgs>({
      methodName: 'remove_offering',
      args: {
        nft_contract_id: this.coreContractId,
        nft_token_id: tokenId,
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(50, 'T'),
    });

    return this.signer.send(mTransaction, { callbackUrl });
  }
}
