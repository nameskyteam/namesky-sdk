import {
  MultiSend,
  View,
  MultiSendAccount,
  MultiTransaction,
  SendOptions,
  SendRawOptions,
  ViewOptions,
  Call,
  CallOptions,
  CallRawOptions,
  MultiSendWalletSelector,
  MultiSendWalletSelectorSendOptions,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorSendRawOptions,
} from 'multi-transaction';
import { FinalExecutionOutcome } from '@near-wallet-selector/core';
import { EmptyArgs } from 'multi-transaction/src/types';

export class NameSkySigner implements View, Call, MultiSend {
  signer: MultiSendAccount | MultiSendWalletSelector;

  constructor(signer: MultiSendAccount | MultiSendWalletSelector) {
    this.signer = signer;
  }

  get accountId(): string {
    if ('accountId' in this.signer) {
      return this.signer.accountId;
    } else {
      const accountId = this.signer.getActiveAccountId();
      if (!accountId) {
        throw Error(`Active account id not found`);
      }
      return accountId;
    }
  }

  view<Value, Args = EmptyArgs>(options: ViewOptions<Value, Args>): Promise<Value> {
    return this.signer.view(options);
  }

  call<Value, Args = EmptyArgs>(
    options: CallOptions<Value, Args> | MultiSendWalletSelectorCallOptions<Value, Args>
  ): Promise<Value> {
    return this.signer.call(options);
  }

  callRaw<Args = EmptyArgs>(
    options: CallRawOptions<Args> | MultiSendWalletSelectorCallRawOptions<Args>
  ): Promise<FinalExecutionOutcome> {
    return this.signer.callRaw(options);
  }

  send<Value>(
    mTx: MultiTransaction,
    options?: SendOptions<Value> | MultiSendWalletSelectorSendOptions<Value>
  ): Promise<Value> {
    return this.signer.send(mTx, options);
  }

  sendRaw(
    mTx: MultiTransaction,
    options?: SendRawOptions | MultiSendWalletSelectorSendRawOptions
  ): Promise<FinalExecutionOutcome[]> {
    return this.signer.sendRaw(mTx, options);
  }
}
