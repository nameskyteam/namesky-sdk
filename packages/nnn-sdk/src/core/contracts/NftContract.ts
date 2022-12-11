import { Contract } from '../../utils/Contract';
import { DEFAULT_MINT_FEE, MultiTransaction } from '../../utils';
import { Amount } from '../../utils';
import { NftRegisterArgs } from '../types/args';
import { NftIsRegisteredOptions, NftRedeemOptions, NftRegisterOptions, NftTransferOptions } from '../types/options';

export class NftContract extends Contract {
  // ------------------------------------------------- View -------------------------------------------------------

  async nftIsRegistered({ args, blockQuery }: NftIsRegisteredOptions): Promise<string | null> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args,
      blockQuery,
    });
  }

  // -------------------------------------------------- Call -------------------------------------------------------

  // signed by registrant
  async nftRegister({ registrantId, args, gas, attachedDeposit }: NftRegisterOptions) {
    const transaction = new MultiTransaction(this.contractId).functionCall<NftRegisterArgs>({
      methodName: 'nft_register',
      args,
      attachedDeposit: attachedDeposit ?? DEFAULT_MINT_FEE,
      gas,
    });
    await this.selector.sendWithLocalKey(registrantId, transaction);
  }

  async nftRedeem({ args, gas, callbackUrl }: NftRedeemOptions): Promise<boolean> {
    const transaction = new MultiTransaction(this.contractId).functionCall({
      methodName: 'nft_redeem',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
    return this.selector.send(transaction, { callbackUrl });
  }

  async nftTransfer({ args, gas, callbackUrl }: NftTransferOptions) {
    const transaction = new MultiTransaction(this.contractId).nft_transfer({
      args,
      gas,
    });
    await this.selector.send(transaction, { callbackUrl });
  }
}
