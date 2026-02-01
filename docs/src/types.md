## type Err<Error>

```javascript
export type Err<Error> = {
    kind: "Err";
    error: Error;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L0-L4)

## type Ok<Value>

```javascript
export type Ok<Value> = {
    kind: "Ok";
    value: Value;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L5-L9)

## type Result<Value>

```javascript
export type Result<Value> = Ok<Value> | Err<string>;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L10-L11)

## Ok

```javascript
export function Ok<const Value>(value: Value): Result<Value> {
```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L12-L12)

## Err

```javascript
export function Err<const Value>(error: string): Result<Value> {
```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L16-L16)

## type BasicTypes

```javascript
export type BasicTypes = string | number | boolean;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L29-L30)

## type BaseParseableTypes

```javascript
export type BaseParseableTypes =
    | string
    | number
    | boolean
    | OneOf
    | VariableList<BaseFlagArguments<BasicTypes>>
    | List<readonly BaseFlagArguments<BasicTypes>[]>;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L31-L38)

## type KnownTypes

```javascript
export type KnownTypes = BaseParseableTypes;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L39-L40)

## type BaseFlagArguments<flagType extends BaseParseableTypes>

```javascript
export type BaseFlagArguments<flagType extends BaseParseableTypes> =
    flagType extends string
        ? StringArgument<string>
        : flagType extends number
          ? NumberArgument<number>
          : flagType extends boolean
            ? BooleanArgument<boolean>
            : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L41-L49)

## type FlagArgument<flagType extends BaseParseableTypes>

```javascript
export type FlagArgument<flagType extends BaseParseableTypes> =
    flagType extends string
        ? StringArgument<string>
        : flagType extends number
          ? NumberArgument<number>
          : flagType extends boolean
            ? BooleanArgument<boolean>
            : flagType extends OneOf
              ? OneOfArgument<string[]>
              : flagType extends VariableList<infer inner>
                ? VariableListArgument<inner>
                : flagType extends List<infer inner>
                  ? ListArgument<inner>
                  : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L50-L64)

## type InferFlagArgumentType<

```javascript
export type InferFlagArgumentType<
    flagArgument extends FlagArgument<KnownTypes>,
> =
    flagArgument extends StringArgument<string>
        ? string
        : flagArgument extends NumberArgument<number>
          ? number
          : flagArgument extends BooleanArgument<boolean>
            ? boolean
            : flagArgument extends OneOfArgument<infer inner>
              ? InferOneOfFlagType<flagArgument>
              : flagArgument extends VariableListArgument<infer inner>
                ? InferVariableListFlagType<flagArgument>
                : flagArgument extends ListArgument<
                        readonly FlagArgument<BasicTypes>[]
                    >
                  ? InferListFlagType<flagArgument>
                  : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L116-L134)

## type FlagResult<

```javascript
export type FlagResult<
    flagArgument extends FlagArgument<KnownTypes>,
    name extends string,
> = {
    flag: Flag<flagArgument, name>;
    isPresent: boolean;
    arguments: Result<InferFlagArgumentType<flagArgument>>;
};

```

A result from a flag: contains the flag name, if it was present in the arguments,
and whether the arguments were parsed as described.
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L139-L147)

## type StringArgument<encode extends string>

```javascript
export type StringArgument<encode extends string> = { kind: "StringArgument" };

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L148-L149)

## string(): FlagArgument

```javascript
export function string(): FlagArgument<string> {
```

An argument parser that treats an argument as a string
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L154-L154)

## type NumberArgument<encode extends number>

```javascript
export type NumberArgument<encode extends number> = {
    kind: "NumberArgument";
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L160-L163)

## number(): NumberArgument

```javascript
export function number(): NumberArgument<number> {
```

An argument parser that treats an argument as a number
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L168-L168)

## type BooleanArgument<encode extends boolean>

```javascript
export type BooleanArgument<encode extends boolean> = {
    kind: "BooleanArgument";
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L174-L177)

## boolean(): BooleanArgument

```javascript
export function boolean(): BooleanArgument<boolean> {
```

An argument parser that treats an argument as a boolean
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L182-L182)

## empty(): FlagArgument

```javascript
export function empty(): FlagArgument<true> {
```

An argument parser that always passes
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L192-L192)

## type ListArgument<

```javascript
export type ListArgument<
    flagTypes extends readonly FlagArgument<BasicTypes>[],
> = {
    kind: "ListArgument";
    items: flagTypes;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L198-L204)

## list

```javascript
export function list<
    const flagTypes extends readonly FlagArgument<BasicTypes>[],
>(flagArgumentParsers: flagTypes): ListArgument<flagTypes> {
```

An argument parser that treats an argument as a list
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L209-L211)

## type VariableListArgument<flagType extends FlagArgument<BasicTypes>>

```javascript
export type VariableListArgument<flagType extends FlagArgument<BasicTypes>> = {
    kind: "VariableListArgument";
    item: flagType;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L218-L222)

## variableList

```javascript
export function variableList<flagType extends FlagArgument<BasicTypes>>(
    flagArgumentParser: flagType,
): VariableListArgument<flagType> {
```

An argument parser that treats an argument as a list
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L236-L238)

## type OneOfArgument<encode extends readonly string[]>

```javascript
export type OneOfArgument<encode extends readonly string[]> = {
    kind: "OneOfArgument";
    items: encode;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L242-L246)

## oneOf

```javascript
export function oneOf<const encode extends readonly string[]>(
    items: encode,
): OneOfArgument<encode> {
```

An argument parser that treats an argument as an enum
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L251-L253)

## type Short<

```javascript
export type Short<
    flagArgument extends FlagArgument<KnownTypes>,
    name extends string,
> = {
    kind: "Short";
    name: name;
    help: string;
    parser: flagArgument;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L260-L269)

## type Long<

```javascript
export type Long<
    flagArgument extends FlagArgument<KnownTypes>,
    name extends string,
> = {
    kind: "Long";
    name: name;
    help: string;
    parser: flagArgument;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L270-L279)

## type Both<

```javascript
export type Both<
    flagArgument extends FlagArgument<KnownTypes>,
    name extends string,
> = {
    kind: "Both";
    shortName: string;
    longName: name;
    help: string;
    parser: flagArgument;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L280-L290)

## type Flag<

```javascript
export type Flag<
    flagType extends FlagArgument<KnownTypes>,
    name extends string,
> = Short<flagType, name> | Long<flagType, name> | Both<flagType, name>;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L291-L295)

## shortFlag

```javascript
export function shortFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(name: name, help: string, parser: flagArgument): Short<flagArgument, name> {
```

A short flag, like -y
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L300-L303)

## longFlag

```javascript
export function longFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(name: name, help: string, parser: flagArgument): Long<flagArgument, name> {
```

A long flag, like --yes
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L311-L314)

## bothFlag

```javascript
export function bothFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(
    shortName: string,
    longName: name,
    help: string,
    parser: flagArgument,
): Both<flagArgument, name> {
```

A short or long flag, like -y or --yes
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L324-L332)

## type InferFlagType<x>

```javascript
export type InferFlagType<x> =
    x extends Flag<FlagArgument<infer flagType>, infer name> ? flagType : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L336-L338)

## type InferFlagName<x>

```javascript
export type InferFlagName<x> =
    x extends Flag<infer flagType, infer name> ? name : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L339-L341)

## type ProgramParser<

```javascript
export type ProgramParser<
    flagTypes extends readonly Flag<FlagArgument<KnownTypes>, string>[],
> = {
    flags: {
        [k in flagTypes[number] as InferFlagName<k>]: k;
    };
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L342-L349)

## type FlagKeys<

```javascript
export type FlagKeys<
    parser extends ProgramParser<Flag<FlagArgument<KnownTypes>, string>[]>,
> = [keyof parser["flags"]];

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L350-L353)

## type FindFlag<

```javascript
export type FindFlag<
    parser extends ProgramParser<Flag<FlagArgument<KnownTypes>, string>[]>,
    name extends string,
> = parser["flags"][name];

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L354-L358)

## type Program<

```javascript
export type Program<
    flagTypes extends readonly Flag<FlagArgument<KnownTypes>, string>[],
> = {
    args: readonly string[];
    readonly flags: {
        [k in flagTypes[number] as InferFlagName<k>]: FlagResult<
            k["parser"],
            InferFlagName<k>
        >;
    };
};

```

A Program contains all arguments given to it, and an record of all the flags
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L362-L373)

## type ProgramValues<

```javascript
export type ProgramValues<
    flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
> = {
    [k in flags[number] as InferFlagName<k>]:
        | InferFlagArgumentType<k["parser"]>
        | undefined;
};

```

Extracted values from a parsed program
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L377-L384)

## type ProgramOf<

```javascript
export type ProgramOf<
    parser extends ProgramParser<
        readonly Flag<FlagArgument<KnownTypes>, string>[]
    >,
> = parser extends ProgramParser<infer flags> ? Program<flags> : never;

```

Infer a Program from a given parser, e.g:

```
function handleFlag(program: ProgramOf<parser>) {}
```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L391-L396)
