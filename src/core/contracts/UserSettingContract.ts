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
import {
  GetUserLastReadNotificationTimeArgs,
  GetUserLikesArgs,
  GetUserWatchListArgs,
  LikeArgs,
  ReadNotificationAtArgs,
  UnlikeArgs,
  UnwatchArgs,
  WatchArgs,
} from '../types/args';

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

  async getUserLikes({ accountId, blockQuery }: GetUserLikesOptions): Promise<string[]> {
    return this.signer.view<string[], GetUserLikesArgs>({
      contractId: this.contractId,
      methodName: 'get_user_likes',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getUserWatchlist({ accountId, blockQuery }: GetUserWatchListOptions): Promise<string[]> {
    return this.signer.view<string[], GetUserWatchListArgs>({
      contractId: this.contractId,
      methodName: 'get_user_watchlist',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async getUserLastReadNotificationTime({
    accountId,
    blockQuery,
  }: GetUserLastReadNotificationTimeOptions): Promise<string[]> {
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

  async like({ tokenId, callbackUrl }: LikeOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<LikeArgs>({
      methodName: 'like',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async unlike({ tokenId, callbackUrl }: UnlikeOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<UnlikeArgs>({
      methodName: 'unlike',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async watch({ tokenId, callbackUrl }: WatchOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<WatchArgs>({
      methodName: 'watch',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async unwatch({ tokenId, callbackUrl }: UnwatchOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<UnwatchArgs>({
      methodName: 'unwatch',
      args: {
        token_id: tokenId,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async readNotificationAt({ timestamp, callbackUrl }: ReadNotificationAtOptions) {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<ReadNotificationAtArgs>({
      methodName: 'read_notification_at',
      args: {
        timestamp,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }
}
