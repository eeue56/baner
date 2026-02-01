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
export type VariableListBasicTypes = BasicTypes | OneOf<readonly string[]>;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L30-L32)

## type BaseParseableTypes

```javascript
export type BaseParseableTypes =
    | string
    | number
    | boolean
    | OneOf<readonly string[]>
    | VariableList<BaseVariableListFlagArguments<VariableListBasicTypes>>
    | List<readonly BaseFlagArguments<BasicTypes>[]>;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L33-L40)

## type KnownTypes

```javascript
export type KnownTypes = BaseParseableTypes;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L41-L42)

## type BaseVariableListFlagArguments<

```javascript
export type BaseVariableListFlagArguments<
    flagType extends VariableListBasicTypes,
> = flagType extends string
    ? StringArgument<string>
    : flagType extends number
      ? NumberArgument<number>
      : flagType extends boolean
        ? BooleanArgument<boolean>
        : flagType extends OneOf<readonly string[]>
          ? OneOfArgument<readonly string[]>
          : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L43-L54)

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

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L55-L63)

## type FlagArgument<flagType extends BaseParseableTypes>

```javascript
export type FlagArgument<flagType extends BaseParseableTypes> =
    flagType extends string
        ? StringArgument<string>
        : flagType extends number
          ? NumberArgument<number>
          : flagType extends boolean
            ? BooleanArgument<boolean>
            : flagType extends OneOf<infer inner>
              ? OneOfArgument<inner>
              : flagType extends VariableList<infer inner>
                ? VariableListArgument<inner>
                : flagType extends List<infer inner>
                  ? ListArgument<inner>
                  : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L64-L78)

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

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L134-L152)

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
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L157-L165)

## type StringArgument<encode extends string>

```javascript
export type StringArgument<encode extends string> = { kind: "StringArgument" };

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L166-L167)

## string(): FlagArgument

```javascript
export function string(): FlagArgument<string> {
```

An argument parser that treats an argument as a string
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L172-L172)

## type NumberArgument<encode extends number>

```javascript
export type NumberArgument<encode extends number> = {
    kind: "NumberArgument";
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L178-L181)

## number(): NumberArgument

```javascript
export function number(): NumberArgument<number> {
```

An argument parser that treats an argument as a number
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L186-L186)

## type BooleanArgument<encode extends boolean>

```javascript
export type BooleanArgument<encode extends boolean> = {
    kind: "BooleanArgument";
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L192-L195)

## boolean(): BooleanArgument

```javascript
export function boolean(): BooleanArgument<boolean> {
```

An argument parser that treats an argument as a boolean
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L200-L200)

## empty(): FlagArgument

```javascript
export function empty(): FlagArgument<true> {
```

An argument parser that always passes
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L210-L210)

## type ListArgument<

```javascript
export type ListArgument<
    flagTypes extends readonly FlagArgument<BasicTypes>[],
> = {
    kind: "ListArgument";
    items: flagTypes;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L216-L222)

## list

```javascript
export function list<
    const flagTypes extends readonly FlagArgument<BasicTypes>[],
>(flagArgumentParsers: flagTypes): ListArgument<flagTypes> {
```

An argument parser that treats an argument as a list
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L227-L229)

## type VariableListArgument<

```javascript
export type VariableListArgument<
    flagType extends FlagArgument<VariableListBasicTypes>,
> = {
    kind: "VariableListArgument";
    item: flagType;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L236-L242)

## variableList

```javascript
export function variableList<
    flagType extends FlagArgument<VariableListBasicTypes>,
>(flagArgumentParser: flagType): VariableListArgument<flagType> {
```

An argument parser that treats an argument as a list
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L256-L258)

## type OneOfArgument<encode extends readonly string[]>

```javascript
export type OneOfArgument<encode extends readonly string[]> = {
    kind: "OneOfArgument";
    items: encode;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L262-L266)

## oneOf

```javascript
export function oneOf<const encode extends readonly string[]>(
    items: encode,
): OneOfArgument<encode> {
```

An argument parser that treats an argument as an enum
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L271-L273)

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

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L280-L289)

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

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L290-L299)

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

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L300-L310)

## type Flag<

```javascript
export type Flag<
    flagType extends FlagArgument<KnownTypes>,
    name extends string,
> = Short<flagType, name> | Long<flagType, name> | Both<flagType, name>;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L311-L315)

## shortFlag

```javascript
export function shortFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(name: name, help: string, parser: flagArgument): Short<flagArgument, name> {
```

A short flag, like -y
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L320-L323)

## longFlag

```javascript
export function longFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(name: name, help: string, parser: flagArgument): Long<flagArgument, name> {
```

A long flag, like --yes
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L331-L334)

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
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L344-L352)

## type InferFlagType<

```javascript
export type InferFlagType<
    x extends Flag<FlagArgument<BaseParseableTypes>, string>,
> = x extends Flag<FlagArgument<infer flagType>, infer name> ? flagType : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L356-L359)

## type InferFlagName<

```javascript
export type InferFlagName<
    x extends Flag<FlagArgument<BaseParseableTypes>, string>,
> = x extends Flag<infer flagType, infer name> ? name : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L360-L363)

## type InferFlagResultType<

```javascript
export type InferFlagResultType<
    x extends FlagResult<FlagArgument<KnownTypes>, string>,
> =
    x extends FlagResult<infer flagArgument, infer name>
        ? InferFlagArgumentType<flagArgument>
        : never;

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L364-L370)

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

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L371-L378)

## type FlagKeys<

```javascript
export type FlagKeys<
    parser extends ProgramParser<Flag<FlagArgument<KnownTypes>, string>[]>,
> = [keyof parser["flags"]];

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L379-L382)

## type FindFlag<

```javascript
export type FindFlag<
    parser extends ProgramParser<Flag<FlagArgument<KnownTypes>, string>[]>,
    name extends string,
> = parser["flags"][name];

```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L383-L387)

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
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L391-L402)

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
[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L406-L413)

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
function handleFlag(program: ProgramOf<typeof parser>) {}
```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L420-L425)

## type ProgramValuesOf<

```javascript
export type ProgramValuesOf<
    parser extends ProgramParser<
        readonly Flag<FlagArgument<KnownTypes>, string>[]
    >,
> = parser extends ProgramParser<infer flags> ? ProgramValues<flags> : never;

```

Infer a ProgramValues from a given parser, e.g:

```
function handleFlag(yes: ProgramValuesOf<typeof parser>["yes"]) {}
```

[View source](https://github.com/eeue56/baner/blob/main/src/types.ts#L432-L437)
