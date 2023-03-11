import { Contract } from '../../utils/Contract';
import { MultiTransaction } from 'multi-transaction';
import {
  GetUserLastReadNotificationTimeOptions,
  GetUserLikesOptions,
  GetUserWatchListOptions,
  LikeOptions,
  ReadNotificationAtOptions,
  UnlikeOptions,
  UnwatchOptions,
  WatchOptions,
} from '../types/options';

export class UserSettingContract extends Contract {
  // ------------------------------------------------- View -------------------------------------------------------

  async get_user_likes({ args, blockQuery }: GetUserLikesOptions): Promise<string[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_user_likes',
      args,
      blockQuery,
    });
  }

  async get_user_watchlist({ args, blockQuery }: GetUserWatchListOptions): Promise<string[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_user_watchlist',
      args,
      blockQuery,
    });
  }

  async get_user_last_read_notification_time({
    args,
    blockQuery,
  }: GetUserLastReadNotificationTimeOptions): Promise<string[]> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_user_last_read_notification_time',
      args,
      blockQuery,
    });
  }

  // -------------------------------------------------- Call -------------------------------------------------------

  async like({ args, gas, callbackUrl }: LikeOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'like',
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async unlike({ args, gas, callbackUrl }: UnlikeOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'unlike',
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async watch({ args, gas, callbackUrl }: WatchOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'watch',
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async unwatch({ args, gas, callbackUrl }: UnwatchOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'unwatch',
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }

  async readNotificationAt({ args, gas, callbackUrl }: ReadNotificationAtOptions) {
    const transaction = MultiTransaction.createTransaction(this.contractId).functionCall({
      methodName: 'read_notification_at',
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }
}
