import {Contract} from "../../utils/Contract";
import {ContractCallOptions} from "../types/common";
import {CreateOfferingArgs, GetAccountViewOfArgs, NearDepositArgs, StorageDepositArgs} from "../types/args";
import {Amount, DEFAULT_STORAGE_DEPOSIT, MultiTransaction} from "../../utils";
import {AccountView} from "../types/data";
import Big from "big.js";

export class MarketContract extends Contract {
  // We have two type of offers, Simple Offer & Pro Offer
  // If Simple Offer, user needs to deposit with the same price
  // If Pro Offer, we recommend user to deposit insufficient balance
  async create_offering({args, gas}: ContractCallOptions<CreateOfferingArgs>) {
    const transaction = new MultiTransaction(this.contractId)
      // first user needs to deposit for storage of new offer
      .functionCall<StorageDepositArgs>({
        methodName: 'storage_deposit',
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
      const accountView = await this.selector.view<AccountView, GetAccountViewOfArgs>({
        contractId: this.contractId,
        methodName: 'get_account_view_of',
        args: {
          account_id: this.selector.getActiveAccountId()!
        }
      })

      let insufficientBalance = Big(args.price).sub(accountView.near_balance)
      insufficientBalance = insufficientBalance.gte(0) ? insufficientBalance : Big(0)

      transaction
        // deposit insufficient balance
        .functionCall<NearDepositArgs>({
          methodName: 'near_deposit',
          attachedDeposit: insufficientBalance.toFixed()
        })
        // create new offer
        .functionCall({
          methodName: 'create_offering',
          args,
          attachedDeposit: Amount.ONE_YOCTO,
          gas
        })
    }

    await this.selector.multiSend(transaction)
  }
}
