import { QueryResponseKind } from '@near-js/types';

export type StateList = QueryResponseKind & {
  values: State[];
};

export type State = {
  key: string;
  value: string;
};
