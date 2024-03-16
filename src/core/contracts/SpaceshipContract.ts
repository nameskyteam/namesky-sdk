import { NameSkyContract } from './NameSkyContract';
import { MultiTransaction, StorageBalance, StorageBalanceBounds, Token } from 'multi-transaction';
import {
  AddFuelOptions,
  DistributeAndClaimRewardsOptions,
  GetRewardsForAccountOptions,
  GetSpaceshipEngineOptions,
  GetSpaceshipOptions,
  GetTotalAddedFuelNumOptions,
  MintSpaceshipOptions,
} from '../types/options';
import { SpaceshipEngine } from '../types/data';
import { DEFAULT_SPACESHIP_STORAGE_DEPOSIT } from '../../utils';

export class SpaceshipContract extends NameSkyContract {
  // ------------------------------------------------- View -------------------------------------------------------

  async get_spaceship({ args, blockQuery }: GetSpaceshipOptions): Promise<Token | undefined> {
    return this.runner.view({
      contractId: this.contractId,
      methodName: 'get_spaceship',
      args,
      blockQuery,
    });
  }

  async get_spaceship_engine({ args, blockQuery }: GetSpaceshipEngineOptions): Promise<SpaceshipEngine | undefined> {
    return this.runner.view({
      contractId: this.contractId,
      methodName: 'get_spaceship_engine',
      args,
      blockQuery,
    });
  }

  async get_rewards_for_account({ args, blockQuery }: GetRewardsForAccountOptions): Promise<string> {
    return this.runner.view({
      contractId: this.contractId,
      methodName: 'get_rewards_for_account',
      args,
      blockQuery,
    });
  }

  async get_total_added_fuel_num({ blockQuery }: GetTotalAddedFuelNumOptions): Promise<string> {
    return this.runner.view({
      contractId: this.contractId,
      methodName: 'get_total_added_fuel_num',
      blockQuery,
    });
  }

  // -------------------------------------------------- Call -------------------------------------------------------

  async mintSpaceship({ spaceshipStorageDeposit, gas, callbackUrl }: MintSpaceshipOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'mint_spaceship',
      attachedDeposit: spaceshipStorageDeposit ?? DEFAULT_SPACESHIP_STORAGE_DEPOSIT,
      gas,
    });

    await this.runner.send(mTx, { callbackUrl });
  }

  async addFuel({ args, gas, callbackUrl }: AddFuelOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'add_fuel',
      args,
      gas,
    });

    await this.runner.send(mTx, { callbackUrl });
  }

  async distributeAndClaimRewards({
    skyTokenId,
    gasForDistribute,
    gasForClaim,
    callbackUrl,
  }: DistributeAndClaimRewardsOptions): Promise<string> {
    const mTx = MultiTransaction.new();

    const storageBalance = await this.runner.view<StorageBalance | undefined>({
      contractId: skyTokenId,
      methodName: 'storage_balance_of',
      args: {
        account_id: this.runner.accountId,
      },
    });

    if (!storageBalance) {
      const storageBalanceBounds = await this.runner.view<StorageBalanceBounds>({
        contractId: skyTokenId,
        methodName: 'storage_balance_bounds',
      });

      mTx.batch(skyTokenId).storageManagement.storageDeposit({
        attachedDeposit: storageBalanceBounds.min,
      });
    }

    mTx
      .batch(this.contractId)
      .functionCall({
        methodName: 'distribute_rewards',
        gas: gasForDistribute,
        args: {
          account_id: this.runner.accountId,
        },
      })
      .functionCall({
        methodName: 'claim_rewards',
        gas: gasForClaim,
      });

    return this.runner.send(mTx, { callbackUrl });
  }
}