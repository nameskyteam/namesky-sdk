import {Optional} from "@near-wallet-selector/core";
import transactions from "@near-wallet-selector/core/lib/wallet/transactions.types";

export type Transaction = Optional<transactions.Transaction, 'signerId'>
