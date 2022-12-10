import { Contract } from '../../utils/Contract';
import { NearDepositArgs } from '../types/args';
import { Amount, DEFAULT_STORAGE_DEPOSIT, MultiTransaction, bigMax } from '../../utils';
import { AccountView } from '../types/data';
import Big from 'big.js';
import { CreateOfferingOptions, GetAccountViewOfOptions } from '../types/options';

export class MarketContract extends Contract {
  // --------------------------------------------------view-------------------------------------------------------

  async get_account_view_of({ args, blockQuery }: GetAccountViewOfOptions): Promise<AccountView> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'get_account_view_of',
      args,
      blockQuery,
    });
  }

  // --------------------------------------------------call-------------------------------------------------------

  // We have two type of offers, Simple Offer & Pro Offer
  // If Simple Offer, user needs to deposit with the same price
  // If Pro Offer, we recommend user to deposit insufficient balance
  async createOffering({ args, gas, attachedDeposit, callbackUrl }: CreateOfferingOptions) {
    const transaction = new MultiTransaction(this.contractId)
      // first user needs to deposit for storage of new offer
      .storage_deposit({
        args: {},
        attachedDeposit: attachedDeposit ?? DEFAULT_STORAGE_DEPOSIT,
      });

    // In case of attached balance not enough, we don't use batch transaction here, we use two separate transactions
    transaction.nextTransaction(this.contractId);

    if (args.is_simple_offering) {
      // create new offer and deposit with the same price
      transaction.functionCall({
        methodName: 'create_offering',
        args,
        attachedDeposit: args.price,
        gas,
      });
    } else {
      const accountView = await this.get_account_view_of({
        args: {
          account_id: this.selector.getActiveAccountId()!,
        },
      });

      const insufficientBalance = bigMax(Big(args.price).sub(accountView.near_balance), Big(0));

      if (insufficientBalance.gt(0)) {
        // deposit insufficient balance
        transaction.functionCall<NearDepositArgs>({
          methodName: 'near_deposit',
          args: {},
          attachedDeposit: insufficientBalance.toFixed(),
        });
      }

      // create new offer
      transaction.functionCall({
        methodName: 'create_offering',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    }

    await this.selector.send(transaction, { callbackUrl });
  }
}
