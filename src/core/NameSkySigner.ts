import {
  Send,
  View,
  MultiSendAccount,
  MultiTransaction,
  ViewOptions,
  Call,
  MultiSendWalletSelector,
  MultiSendWalletSelectorSendOptions,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorSendRawOptions,
  EmptyArgs,
} from 'multi-transaction';
import { FinalExecutionOutcome } from '@near-wallet-selector/core';
import {
  MultiSendAccountCallOptions,
  MultiSendAccountCallRawOptions,
  MultiSendAccountSendOptions,
  MultiSendAccountSendRawOptions,
} from 'multi-transaction';
import { Network } from '../types';
import { JsonRpcProvider } from 'near-api-js/lib/providers/json-rpc-provider';
import { NameSkySignerError } from '../errors';

export class NameSkySigner implements View, Call, Send {
  sender: MultiSendAccount | MultiSendWalletSelector;

  private constructor(sender: MultiSendAccount | MultiSendWalletSelector) {
    this.sender = sender;
  }

  static fromAccount(account: MultiSendAccount): NameSkySigner {
    return new NameSkySigner(account);
  }

  static fromWalletSelector(selector: MultiSendWalletSelector): NameSkySigner {
    return new NameSkySigner(selector);
  }

  get network(): Network {
    if ('accountId' in this.sender) {
      return {
        networkId: this.sender.connection.networkId,
        nodeUrl: (this.sender.connection.provider as JsonRpcProvider).connection.url,
      };
    } else {
      return {
        networkId: this.sender.options.network.networkId,
        nodeUrl: this.sender.options.network.nodeUrl,
      };
    }
  }

  get accountId(): string {
    if ('accountId' in this.sender) {
      return this.sender.accountId;
    } else {
      const accountId = this.sender.getActiveAccount()?.accountId;
      if (!accountId) {
        throw new NameSkySignerError(`Active account id not found`);
      }
      return accountId;
    }
  }

  view<Value, Args = EmptyArgs>(options: ViewOptions<Value, Args>): Promise<Value> {
    return this.sender.view(options);
  }

  call<Value, Args = EmptyArgs>(
    options: MultiSendAccountCallOptions<Value, Args> | MultiSendWalletSelectorCallOptions<Value, Args>,
  ): Promise<Value> {
    return this.sender.call(options);
  }

  callRaw<Args = EmptyArgs>(
    options: MultiSendAccountCallRawOptions<Args> | MultiSendWalletSelectorCallRawOptions<Args>,
  ): Promise<FinalExecutionOutcome> {
    return this.sender.callRaw(options);
  }

  send<Value>(
    mTransaction: MultiTransaction,
    options?: MultiSendAccountSendOptions<Value> | MultiSendWalletSelectorSendOptions<Value>,
  ): Promise<Value> {
    return this.sender.send(mTransaction, options);
  }

  sendRaw(
    mTransaction: MultiTransaction,
    options?: MultiSendAccountSendRawOptions | MultiSendWalletSelectorSendRawOptions,
  ): Promise<FinalExecutionOutcome[]> {
    return this.sender.sendRaw(mTransaction, options);
  }
}
