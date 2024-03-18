import { QueryResponseKind } from '@near-js/types/lib/provider/response';

export type StateList = QueryResponseKind & {
  values: State[];
};

export type State = {
  key: string;
  value: string;
};
