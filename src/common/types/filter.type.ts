export type FilterValueType =
  | 'string'
  | 'number'
  | 'number[]'
  | 'boolean'
  | 'string[]';

export interface FilterSchemaItem {
  type: FilterValueType;
  optional?: boolean;
}

export type FilterSchema = Record<string, FilterSchemaItem>;

export type InferFilterValue<T extends FilterValueType> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'number[]'
      ? number[]
      : T extends 'string[]'
        ? string[]
        : T extends 'boolean'
          ? boolean
          : never;

export type InferFilter<S extends FilterSchema> = {
  [K in keyof S]?: InferFilterValue<S[K]['type']>;
};
