import { BaseContract, BaseContractOptions } from './BaseContract';
import { MultiTransaction } from 'multi-transaction';
import {
  LikeOptions,
  ReadNotificationAtOptions,
  UnlikeOptions,
  UnwatchOptions,
  WatchOptions,
  GetUserLastReadNotificationTimeOptions,
  GetUserLikesOptions,
  GetUserWatchListOptions,
  GetUserLastReadNotificationTimeArgs,
  GetUserLikesArgs,
  GetUserWatchListArgs,
  LikeArgs,
  ReadNotificationAtArgs,
  UnlikeArgs,
  UnwatchArgs,
  WatchArgs,
} from '../../types';
import { NameSkySigner } from '../NameSkySigner';

export type UserSettingContractOptions = BaseContractOptions;

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

  async getUserLikes(options: GetUserLikesOptions): Promise<string[]> {
    const { accountId, blockQuery } = options;
    return this.signer.view<string[], GetUserLikesArgs>({
      contractId: this.contractId,
      methodName: 'get_user_likes',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getUserWatchlist(options: GetUserWatchListOptions): Promise<string[]> {
    const { accountId, blockQuery } = options;
    return this.signer.view<string[], GetUserWatchListArgs>({
      contractId: this.contractId,
      methodName: 'get_user_watchlist',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getUserLastReadNotificationTime(options: GetUserLastReadNotificationTimeOptions): Promise<string[]> {
    const { accountId, blockQuery } = options;
    return this.signer.view<string[], GetUserLastReadNotificationTimeArgs>({
      contractId: this.contractId,
      methodName: 'get_user_last_read_notification_time',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  // -------------------------------------------------- Change -----------------------------------------------------

  async like(options: LikeOptions) {
    const { tokenId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<LikeArgs>({
      methodName: 'like',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async unlike(options: UnlikeOptions) {
    const { tokenId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<UnlikeArgs>({
      methodName: 'unlike',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async watch(options: WatchOptions) {
    const { tokenId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<WatchArgs>({
      methodName: 'watch',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async unwatch(options: UnwatchOptions) {
    const { tokenId, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<UnwatchArgs>({
      methodName: 'unwatch',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }

  async readNotificationAt(options: ReadNotificationAtOptions = {}) {
    const { timestamp, callbackUrl } = options;
    const mTransaction = MultiTransaction.batch(this.contractId).functionCall<ReadNotificationAtArgs>({
      methodName: 'read_notification_at',
      args: {
        timestamp,
      },
    });

    await this.signer.send(mTransaction, { callbackUrl });
  }
}
