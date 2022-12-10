import {
  FinalExecutionOutcome,
  FinalExecutionStatus,
} from "near-api-js/lib/providers";
import { ExecutionStatus } from "near-api-js/lib/providers/provider";
import { parseRpcError } from "near-api-js/lib/utils/rpc_errors";
import { ErrorMessage } from "../types/outcome";

export function parseOutcomeValue<Value>(
  outcome: FinalExecutionOutcome
): Value {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue;
  if (successValue) {
    const decodedValue: string = Buffer.from(successValue, "base64").toString();
    return JSON.parse(decodedValue);
  } else {
    return void 0 as unknown as Value;
  }
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
