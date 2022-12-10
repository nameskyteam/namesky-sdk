import { AccessKeyPermission, Action } from '../types';
import {
  NearApiJsActionLike,
  NearApiJsTransactionLike,
  NearWalletSelectorActionLike,
  NearWalletSelectorTransactionLike,
} from '../types';
import * as nearApiJs from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { AccessKey } from 'near-api-js/lib/transaction';
import { Transaction } from '../types';

export function parseNearApiJsAction(action: Action): NearApiJsActionLike {
  switch (action.type) {
    case 'CreateAccount': {
      return nearApiJs.transactions.createAccount();
    }
    case 'DeleteAccount': {
      const { beneficiaryId } = action.params;
      return nearApiJs.transactions.deleteAccount(beneficiaryId);
    }
    case 'AddKey': {
      const { publicKey, accessKey } = action.params;
      return nearApiJs.transactions.addKey(PublicKey.fromString(publicKey), getAccessKey(accessKey.permission));
    }
    case 'DeleteKey': {
      const { publicKey } = action.params;
      return nearApiJs.transactions.deleteKey(PublicKey.fromString(publicKey));
    }
    case 'DeployContract': {
      const { code } = action.params;
      return nearApiJs.transactions.deployContract(code);
    }
    case 'Stake': {
      const { amount, publicKey } = action.params;
      return nearApiJs.transactions.stake(amount, PublicKey.fromString(publicKey));
    }
    case 'FunctionCall': {
      const { methodName, args, gas, attachedDeposit } = action.params;
      return nearApiJs.transactions.functionCall(methodName, args, gas, attachedDeposit);
    }
    case 'Transfer': {
      const { amount } = action.params;
      return nearApiJs.transactions.transfer(amount);
    }
  }
}

export function parseNearApiJsTransaction({ receiverId, actions }: Transaction): NearApiJsTransactionLike {
  return {
    receiverId,
    actions: actions.map((action) => parseNearApiJsAction(action)),
  };
}

export function parseNearWalletSelectorAction(action: Action): NearWalletSelectorActionLike {
  switch (action.type) {
    case 'CreateAccount': {
      return action;
    }
    case 'DeleteAccount': {
      return action;
    }
    case 'AddKey': {
      return action;
    }
    case 'DeleteKey': {
      return action;
    }
    case 'DeployContract': {
      return action;
    }
    case 'Stake': {
      const { amount, publicKey } = action.params;
      return {
        type: action.type,
        params: {
          stake: amount,
          publicKey,
        },
      };
    }
    case 'FunctionCall': {
      const { methodName, args, gas, attachedDeposit } = action.params;
      return {
        type: action.type,
        params: {
          methodName,
          args,
          gas,
          deposit: attachedDeposit,
        },
      };
    }
    case 'Transfer': {
      const { amount } = action.params;
      return {
        type: action.type,
        params: {
          deposit: amount,
        },
      };
    }
  }
}

export function parseNearWalletSelectorTransaction({
  signerId,
  receiverId,
  actions,
}: Transaction): NearWalletSelectorTransactionLike {
  return {
    signerId,
    receiverId,
    actions: actions.map((action) => parseNearWalletSelectorAction(action)),
  };
}

function getAccessKey(permission: AccessKeyPermission): AccessKey {
  if (permission === 'FullAccess') {
    return nearApiJs.transactions.fullAccessKey();
  } else {
    const { receiverId, methodNames, allowance } = permission;
    return nearApiJs.transactions.functionCallAccessKey(receiverId, methodNames, allowance);
  }
}
