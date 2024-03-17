import {
  MultiSend,
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
} from 'multi-transaction';
import { FinalExecutionOutcome } from '@near-wallet-selector/core';
import { EmptyArgs } from 'multi-transaction/src/types';
import {
  MultiSendAccountCallOptions,
  MultiSendAccountCallRawOptions,
  MultiSendAccountSendOptions,
  MultiSendAccountSendRawOptions,
} from 'multi-transaction/dist/core/MultiSendAccount';

export class NameSkySigner implements View, Call, MultiSend {
  multiSender: MultiSendAccount | MultiSendWalletSelector;

  private constructor(multiSender: MultiSendAccount | MultiSendWalletSelector) {
    this.multiSender = multiSender;
  }

  static fromAccount(account: MultiSendAccount): NameSkySigner {
    return new NameSkySigner(account);
  }

  static fromWalletSelector(selector: MultiSendWalletSelector): NameSkySigner {
    return new NameSkySigner(selector);
  }

  get accountId(): string {
    if ('accountId' in this.multiSender) {
      return this.multiSender.accountId;
    } else {
      const accountId = this.multiSender.getActiveAccountId();
      if (!accountId) {
        throw Error(`Active account id not found`);
      }
      return accountId;
    }
  }

  view<Value, Args = EmptyArgs>(options: ViewOptions<Value, Args>): Promise<Value> {
    return this.multiSender.view(options);
  }

  call<Value, Args = EmptyArgs>(
    options: MultiSendAccountCallOptions<Value, Args> | MultiSendWalletSelectorCallOptions<Value, Args>
  ): Promise<Value> {
    return this.multiSender.call(options);
  }

  callRaw<Args = EmptyArgs>(
    options: MultiSendAccountCallRawOptions<Args> | MultiSendWalletSelectorCallRawOptions<Args>
  ): Promise<FinalExecutionOutcome> {
    return this.multiSender.callRaw(options);
  }

  send<Value>(
    mTx: MultiTransaction,
    options?: MultiSendAccountSendOptions<Value> | MultiSendWalletSelectorSendOptions<Value>
  ): Promise<Value> {
    return this.multiSender.send(mTx, options);
  }

  sendRaw(
    mTx: MultiTransaction,
    options?: MultiSendAccountSendRawOptions | MultiSendWalletSelectorSendRawOptions
  ): Promise<FinalExecutionOutcome[]> {
    return this.multiSender.sendRaw(mTx, options);
  }
}
