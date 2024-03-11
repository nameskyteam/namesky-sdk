import { Contract } from '../../utils/Contract';
import { MultiTransaction } from 'multi-transaction';
import {
  AddFuelOptions,
  DistributeAndClaimRewardsOptions,
  GetRewardsForAccountOptions,
  GetSpaceshipEngineOptions,
  GetTotalAddedFuelNumOptions,
  MintSpaceshipOptions,
} from '../types/options';
import { SpaceshipEngine } from '../types/data';
import { DEFAULT_SPACESHIP_STORAGE_DEPOSIT } from '../../utils';

export class SpaceshipContract extends Contract {
  // ------------------------------------------------- View -------------------------------------------------------

  async get_spaceship_engine({ args, blockQuery }: GetSpaceshipEngineOptions): Promise<SpaceshipEngine | undefined> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_spaceship_engine',
      args,
      blockQuery,
    });
  }

  async get_rewards_for_account({ args, blockQuery }: GetRewardsForAccountOptions): Promise<string> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_rewards_for_account',
      args,
      blockQuery,
    });
  }

  async get_total_added_fuel_num({ blockQuery }: GetTotalAddedFuelNumOptions): Promise<string> {
    return this.selector.view({
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

    await this.selector.send(mTx, { callbackUrl });
  }

  async addFuel({ args, gas, callbackUrl }: AddFuelOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'add_fuel',
      args,
      gas,
    });

    await this.selector.send(mTx, { callbackUrl });
  }

  async distributeAndClaimRewards({
    gasForDistribute,
    gasForClaim,
    callbackUrl,
  }: DistributeAndClaimRewardsOptions): Promise<string> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'distribute_rewards',
      gas: gasForDistribute,
    });

    mTx.functionCall({
      methodName: 'claim_rewards',
      gas: gasForClaim,
    });

    return this.selector.send(mTx, { callbackUrl });
  }
}
