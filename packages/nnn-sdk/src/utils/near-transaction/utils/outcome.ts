import {FinalExecutionOutcome, FinalExecutionStatus} from "near-api-js/lib/providers";

export function parseOutcomeValue<Value> (outcome: FinalExecutionOutcome): Value {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue
  if (successValue) {
    const decodedValue: string = Buffer.from(successValue, 'base64').toString()
    return JSON.parse(decodedValue)
  } else {
    return void 0 as Value
  }
}
