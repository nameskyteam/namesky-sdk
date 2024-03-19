import { BaseContract, BaseContractOptions } from './BaseContract';
import { Gas, MultiTransaction, StorageBalance, StorageBalanceBounds, Token } from 'multi-transaction';
import { AddFuelOptions, ClaimRewardsOptions, MintSpaceshipOptions } from '../types/change-options';
import {
  GetRewardsForAccountOptions,
  GetRewardTokenIdOptions,
  GetSpaceshipEngineOptions,
  GetSpaceshipOptions,
  GetTotalAddedFuelNumOptions,
} from '../types/view-options';
import { SpaceshipEngine } from '../types/data';
import { NameSkySigner } from '../NameSkySigner';
import { AddFuelArgs, DistributeRewardsArgs, GetRewardsForAccountArgs, GetSpaceshipArgs } from '../types/args';
import { DEFAULT_SPACESHIP_STORAGE_DEPOSIT } from '../../utils/constants';

export type SpaceshipContractOptions = BaseContractOptions & {};

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

  async getSpaceship({ accountId, blockQuery }: GetSpaceshipOptions): Promise<Token | undefined> {
    return this.signer.view<Token | undefined, GetSpaceshipArgs>({
      contractId: this.contractId,
      methodName: 'get_spaceship',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getSpaceshipEngine({ accountId, blockQuery }: GetSpaceshipEngineOptions): Promise<SpaceshipEngine | undefined> {
    return this.signer.view<SpaceshipEngine | undefined, GetSpaceshipArgs>({
      contractId: this.contractId,
      methodName: 'get_spaceship_engine',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getRewardTokenId({ blockQuery }: GetRewardTokenIdOptions): Promise<string> {
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_reward_token_id',
      blockQuery,
    });
  }

  async getRewardsForAccount({ accountId, blockQuery }: GetRewardsForAccountOptions): Promise<string> {
    return this.signer.view<string, GetRewardsForAccountArgs>({
      contractId: this.contractId,
      methodName: 'get_rewards_for_account',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getTotalAddedFuelNum({ blockQuery }: GetTotalAddedFuelNumOptions): Promise<string> {
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_total_added_fuel_num',
      blockQuery,
    });
  }

  // -------------------------------------------------- Change -----------------------------------------------------

  async mintSpaceship({ callbackUrl }: MintSpaceshipOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'mint_spaceship',
      attachedDeposit: DEFAULT_SPACESHIP_STORAGE_DEPOSIT,
      gas: Gas.parse(50, 'T'),
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async addFuel({ quantity, callbackUrl }: AddFuelOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<AddFuelArgs>({
      methodName: 'add_fuel',
      args: {
        quantity,
      },
      gas: Gas.parse(50, 'T'),
    });

    await this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  async claimRewards({ callbackUrl }: ClaimRewardsOptions): Promise<string> {
    const rewardTokenId = await this.getRewardTokenId({});

    const mTx = MultiTransaction.new();

    const storageBalance = await this.signer.view<StorageBalance | undefined>({
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

      mTx.batch(rewardTokenId).storageManagement.storage_deposit({
        attachedDeposit: storageBalanceBounds.min,
      });
    }

    mTx
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

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }
}
