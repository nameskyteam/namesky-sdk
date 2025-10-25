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
  JsonArgs,
  ViewRawOptions,
} from 'multi-transaction';
import { CallContractViewFunctionResultRaw, FinalExecutionOutcome } from '@near-js/types';
import {
  MultiSendAccountCallOptions,
  MultiSendAccountCallRawOptions,
  MultiSendAccountSendOptions,
  MultiSendAccountSendRawOptions,
} from 'multi-transaction';
import { Network } from '../types';
import { JsonRpcProvider } from '@near-js/providers';
import { NameSkySignerError } from '../errors';

export class NameSkyUser implements View, Call, Send {
  sender: MultiSendAccount | MultiSendWalletSelector;
  private readonly networkId: string;

  private constructor(sender: MultiSendAccount | MultiSendWalletSelector, networkId: string) {
    this.sender = sender;
    this.networkId = networkId;
  }

  static fromAccount(account: MultiSendAccount, networkId: string): NameSkyUser {
    return new NameSkyUser(account, networkId);
  }

  static fromWalletSelector(selector: MultiSendWalletSelector): NameSkyUser {
    return new NameSkyUser(selector, selector.options.network.networkId);
  }

  get network(): Network {
    if ('accountId' in this.sender) {
      return {
        networkId: this.networkId,
        nodeUrl: (this.sender.provider as JsonRpcProvider).connection.url,
      };
    } else {
      return {
        networkId: this.networkId,
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

  view<Value, Args = JsonArgs>(options: ViewOptions<Value, Args>): Promise<Value> {
    return this.sender.view(options);
  }

  viewRaw<Args = JsonArgs>(options: ViewRawOptions<Args>): Promise<CallContractViewFunctionResultRaw> {
    return this.sender.viewRaw(options);
  }

  call<Value, Args = JsonArgs>(
    options: MultiSendAccountCallOptions<Value, Args> | MultiSendWalletSelectorCallOptions<Value, Args>,
  ): Promise<Value> {
    return this.sender.call(options);
  }

  callRaw<Args = JsonArgs>(
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
