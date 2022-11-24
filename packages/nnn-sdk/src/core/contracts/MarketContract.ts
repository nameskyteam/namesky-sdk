import {Contract} from "../../utils/Contract";
import {CreateOfferingArgs, GetAccountViewOfArgs, NearDepositArgs} from "../types/args";
import {
  Amount,
  DEFAULT_STORAGE_DEPOSIT,
  MultiTransaction,
  FunctionCallOptions,
  FunctionViewOptions,
  subGteZero
} from "../../utils";
import {AccountView} from "../types/data";
import Big from "big.js";

export class MarketContract extends Contract {
  // We have two type of offers, Simple Offer & Pro Offer
  // If Simple Offer, user needs to deposit with the same price
  // If Pro Offer, we recommend user to deposit insufficient balance
  async createOffering({args, gas}: FunctionCallOptions<CreateOfferingArgs>) {
    const transaction = new MultiTransaction(this.contractId)
      // first user needs to deposit for storage of new offer
      .storage_deposit({
        args: {},
        attachedDeposit: DEFAULT_STORAGE_DEPOSIT
      })
      // In case of attached balance not enough, we don't use batch transaction here, we use two separate transactions
      .nextTransaction(this.contractId)

    if (args.is_simple_offering) {
      transaction.
        // create new offer and deposit with the same price
        functionCall({
          methodName: 'create_offering',
          args,
          attachedDeposit: args.price,
          gas
        })
    } else {
      const accountView = await this.get_account_view_of({
        args: {
          account_id: this.selector.getActiveAccountId()!
        }
      })

      const insufficientBalance = subGteZero(Big(args.price), Big(accountView.near_balance))

      if (insufficientBalance.gt(0)) {
        // deposit insufficient balance
        transaction.functionCall<NearDepositArgs>({
          methodName: 'near_deposit',
          args: {},
          attachedDeposit: insufficientBalance.toFixed()
        })
      }

      // create new offer
      transaction.functionCall({
        methodName: 'create_offering',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas
      })
    }

    await this.selector.send(transaction)
  }

  async get_account_view_of({args}: FunctionViewOptions<GetAccountViewOfArgs>): Promise<AccountView> {
    return  this.selector.view({
      contractId: this.contractId,
      methodName: 'get_account_view_of',
      args
    })
  }
}
