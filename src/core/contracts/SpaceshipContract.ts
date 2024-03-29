import { BaseContract, BaseContractOptions } from './BaseContract';
import {
  Gas,
  MultiTransaction,
  StorageBalance,
  StorageBalanceBounds,
  StorageBalanceOfArgs,
  Token,
} from 'multi-transaction';
import {
  AddFuelOptions,
  ClaimRewardsOptions,
  MintSpaceshipOptions,
  GetRewardsForAccountOptions,
  GetRewardTokenIdOptions,
  GetSpaceshipEngineOptions,
  GetSpaceshipOptions,
  GetTotalAddedFuelNumOptions,
  AddFuelArgs,
  DistributeRewardsArgs,
  GetRewardsForAccountArgs,
  GetSpaceshipArgs,
  GetSpaceshipEngineArgs,
  SpaceshipEngine,
} from '../types';
import { NameSkySigner } from '../NameSkySigner';
import { DEFAULT_SPACESHIP_STORAGE_DEPOSIT } from '../../utils/constants';

export type SpaceshipContractOptions = BaseContractOptions;

export class SpaceshipContract extends BaseContract {
  constructor(options: SpaceshipContractOptions) {
    super(options);
  }

  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): SpaceshipContract {
    return new SpaceshipContract({
      contractId: this.contractId,
      signer,
    });
  }

  // ------------------------------------------------- View -------------------------------------------------------

  async getSpaceship(options: GetSpaceshipOptions): Promise<Token | undefined> {
    const { accountId, blockQuery } = options;
    return this.signer.view<Token | undefined, GetSpaceshipArgs>({
      contractId: this.contractId,
      methodName: 'get_spaceship',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getSpaceshipEngine(options: GetSpaceshipEngineOptions): Promise<SpaceshipEngine | undefined> {
    const { accountId, blockQuery } = options;
    return this.signer.view<SpaceshipEngine | undefined, GetSpaceshipEngineArgs>({
      contractId: this.contractId,
      methodName: 'get_spaceship_engine',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getRewardTokenId(options: GetRewardTokenIdOptions = {}): Promise<string> {
    const { blockQuery } = options;
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_reward_token_id',
      blockQuery,
    });
  }

  async getRewardsForAccount(options: GetRewardsForAccountOptions): Promise<string> {
    const { accountId, blockQuery } = options;
    return this.signer.view<string, GetRewardsForAccountArgs>({
      contractId: this.contractId,
      methodName: 'get_rewards_for_account',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getTotalAddedFuelNum(options: GetTotalAddedFuelNumOptions = {}): Promise<string> {
    const { blockQuery } = options;
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_total_added_fuel_num',
      blockQuery,
    });
  }

  // -------------------------------------------------- Change -----------------------------------------------------

  async mintSpaceship(options: MintSpaceshipOptions = {}) {
    const { callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'mint_spaceship',
      attachedDeposit: DEFAULT_SPACESHIP_STORAGE_DEPOSIT,
      gas: Gas.parse(50, 'T'),
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async addFuel(options: AddFuelOptions) {
    const { quantity, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<AddFuelArgs>({
      methodName: 'add_fuel',
      args: {
        quantity,
      },
      gas: Gas.parse(50, 'T'),
    });

    await this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }

  async claimRewards(options: ClaimRewardsOptions = {}): Promise<string> {
    const { callbackUrl } = options;
    const rewardTokenId = await this.getRewardTokenId({});

    const mTransaction = MultiTransaction.new();

    const storageBalance = await this.signer.view<StorageBalance | undefined, StorageBalanceOfArgs>({
      contractId: rewardTokenId,
      methodName: 'storage_balance_of',
      args: {
        account_id: this.signer.accountId,
      },
    });

    if (!storageBalance) {
      const storageBalanceBounds = await this.signer.view<StorageBalanceBounds>({
        contractId: rewardTokenId,
        methodName: 'storage_balance_bounds',
      });

      mTransaction.batch(rewardTokenId).storage.deposit({
        attachedDeposit: storageBalanceBounds.min,
      });
    }

    mTransaction
      .batch(this.contractId)
      .functionCall<DistributeRewardsArgs>({
        methodName: 'distribute_rewards',
        args: {
          account_id: this.signer.accountId,
        },
      })
      .functionCall({
        methodName: 'claim_rewards',
        gas: Gas.parse(50, 'T'),
      });

    return this.signer.send(mTransaction, { callbackUrl, throwReceiptErrors: true });
  }
}
