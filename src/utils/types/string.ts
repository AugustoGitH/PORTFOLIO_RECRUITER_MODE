export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;

export type ExtractVariables<
  T extends string,
  Start extends string,
  End extends string,
> = T extends `${infer _Start}${Start}${infer Var}${End}${infer EndPart}`
  ? Var | ExtractVariables<EndPart, Start, End>
  : never

export type CreateTypeFromString<
  T extends string,
  Start extends string,
  End extends string,
> = { [K in ExtractVariables<T, Start, End>]: Primitive }

export type FilterStringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

// Helper type for subtraction in conditional types to limit recursion depth
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ...0[]]

// Filter out function properties and array methods
type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

// Type that extracts all possible keys, including nested ones with dot notation
// Limited to prevent infinite recursion on circular references
// Filters out function properties and array methods
export type DeepKeyOf<T, Depth extends number = 8> = [Depth] extends [never]
  ? never
  : T extends ReadonlyArray<any>
    ? never // Don't traverse into arrays to avoid array methods
    : T extends object
      ? {
          [K in NonFunctionKeys<T> & (string | number)]: T[K] extends Primitive
            ? K
            : T[K] extends ReadonlyArray<any>
              ? K // Include array property name but don't traverse into it
              : NonNullable<T[K]> extends object
                ? K | `${K}.${DeepKeyOf<NonNullable<T[K]>, Prev[Depth]>}`
                : K
        }[NonFunctionKeys<T> & (string | number)]
      : never


// More specific union handling that preserves autocomplete
// This creates a union of all possible paths from all members
export type DistributiveFieldPath<T> = T extends any 
  ? keyof T | DeepKeyOf<T>
  : never

// Alternative approach that forces distribution over union types
export type ForceDistributiveKeys<T> = T extends infer U 
  ? U extends any 
    ? keyof U | DeepKeyOf<U>
    : never
  : never

// Type that represents a valid path on an object or a direct key
export type FieldPath<T> = keyof T | DeepKeyOf<T>

// Helper type for editing contexts where we need paths valid for at least one union member
export type FieldPathUnion<T> = ForceDistributiveKeys<T>

// Helper type for complex union types where nested path inference might fail
// This preserves specific types when possible but allows string as fallback
// Using (string & {}) pattern to allow autocomplete while accepting any string
export type FieldPathLoose<T> = FieldPathUnion<T> | (string & {})
