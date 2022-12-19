import { FinalExecutionOutcome, FinalExecutionStatus } from 'near-api-js/lib/providers';
import { ExecutionStatus } from 'near-api-js/lib/providers/provider';
import { parseRpcError } from 'near-api-js/lib/utils/rpc_errors';
import { ErrorMessage } from '../types/outcome';
import { ResponseParser } from '../types';

export function parseOutcomeValue<Value>(
  outcome: FinalExecutionOutcome,
  parse?: ResponseParser<Value>
): Value | undefined {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue;
  if (successValue) {
    const valueRaw = Buffer.from(successValue, 'base64');
    if (parse) {
      return parse(valueRaw);
    }
    // default JSON parser
    return JSON.parse(valueRaw.toString());
  }
  return;
}

export function throwReceiptsErrorIfAny(outcome: FinalExecutionOutcome) {
  const receipts = outcome.receipts_outcome;
  const errorMessages: ErrorMessage[] = [];
  receipts.forEach((receipt) => {
    const status = receipt.outcome.status as ExecutionStatus;
    if (status.Failure) {
      const serverError = parseRpcError(status.Failure);
      const errorMessage: ErrorMessage = JSON.parse(serverError.message);
      errorMessages.push(errorMessage);
    }
  });
  if (errorMessages.length !== 0) {
    throw new Error(JSON.stringify(errorMessages));
  }
}
