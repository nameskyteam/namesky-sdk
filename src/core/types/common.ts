import { QueryResponseKind } from '@near-js/types/lib/provider/response';

export type UpdateWrapper<T> =
  | {
      UpdateSome: T;
    }
  | 'UpdateNone';

export interface StateList extends QueryResponseKind {
  values: State[];
}
export interface State {
  key: string;
  value: string;
}
