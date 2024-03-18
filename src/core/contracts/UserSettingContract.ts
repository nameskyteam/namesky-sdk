import { BaseContract, BaseContractOptions } from './BaseContract';
import { MultiTransaction } from 'multi-transaction';
import {
  LikeOptions,
  ReadNotificationAtOptions,
  UnlikeOptions,
  UnwatchOptions,
  WatchOptions,
} from '../types/change-options';
import {
  GetUserLastReadNotificationTimeOptions,
  GetUserLikesOptions,
  GetUserWatchListOptions,
} from '../types/view-options';
import { NameSkySigner } from '../NameSkySigner';

export type UserSettingContractOptions = BaseContractOptions & {};

export class UserSettingContract extends BaseContract {
  constructor(options: UserSettingContractOptions) {
    super(options);
  }

  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): UserSettingContract {
    return new UserSettingContract({
      contractId: this.contractId,
      signer,
    });
  }

  // ------------------------------------------------- View -------------------------------------------------------

  async getUserLikes({ args, blockQuery }: GetUserLikesOptions): Promise<string[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_user_likes',
      args,
      blockQuery,
    });
  }

  async getUserWatchlist({ args, blockQuery }: GetUserWatchListOptions): Promise<string[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_user_watchlist',
      args,
      blockQuery,
    });
  }

  async getUserLastReadNotificationTime({
    args,
    blockQuery,
  }: GetUserLastReadNotificationTimeOptions): Promise<string[]> {
    return this.signer.view({
      contractId: this.contractId,
      methodName: 'get_user_last_read_notification_time',
      args,
      blockQuery,
    });
  }

  // -------------------------------------------------- Call -------------------------------------------------------

  async like({ args, gas, callbackUrl }: LikeOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'like',
      args,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async unlike({ args, gas, callbackUrl }: UnlikeOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'unlike',
      args,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async watch({ args, gas, callbackUrl }: WatchOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'watch',
      args,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async unwatch({ args, gas, callbackUrl }: UnwatchOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'unwatch',
      args,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async readNotificationAt({ args, gas, callbackUrl }: ReadNotificationAtOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall({
      methodName: 'read_notification_at',
      args,
      gas,
    });

    await this.signer.send(mTx, { callbackUrl });
  }
}
