export type Err<error> = {
    kind: "Err";
    error: error;
};

export type Ok<value> = {
    kind: "Ok";
    value: value;
};

export type Result<value> = Ok<value> | Err<string>;

export function Ok<const value>(value: value): Result<value> {
    return { kind: "Ok", value };
}

export function Err<const value>(error: string): Result<value> {
    return { kind: "Err", error };
}

const OneOf = Symbol("OneOf");
type OneOf<x extends readonly string[]> = typeof OneOf;

const VariableList = Symbol("VariableList");
type VariableList<x extends FlagArgument<VariableListBasicTypes>> =
    typeof VariableList;

const List = Symbol("List");
type List<x extends readonly FlagArgument<BasicTypes>[]> = typeof List;

export type BasicTypes = string | number | boolean;
export type VariableListBasicTypes = BasicTypes | OneOf<readonly string[]>;

export type BaseParseableTypes =
    | BasicTypes
    | OneOf<readonly string[]>
    | VariableList<BaseVariableListFlagArgument<VariableListBasicTypes>>
    | List<readonly BaseFlagArgument<BasicTypes>[]>;

export type KnownTypes = BaseParseableTypes;

export type BaseVariableListFlagArgument<
    flagType extends VariableListBasicTypes,
> = flagType extends BasicTypes
    ? BaseFlagArgument<flagType>
    : flagType extends OneOf<readonly string[]>
      ? OneOfArgument<readonly string[]>
      : never;

export type BaseFlagArgument<flagType extends BasicTypes> =
    flagType extends string
        ? StringArgument<string>
        : flagType extends number
          ? NumberArgument<number>
          : flagType extends boolean
            ? BooleanArgument<boolean>
            : never;

export type FlagArgument<flagType extends BaseParseableTypes> =
    flagType extends BasicTypes
        ? BaseFlagArgument<flagType>
        : flagType extends OneOf<infer inner>
          ? OneOfArgument<inner>
          : flagType extends VariableList<infer inner>
            ? VariableListArgument<inner>
            : flagType extends List<infer inner>
              ? ListArgument<inner>
              : never;

type InferVariableListFlagType<
    flagArgument extends VariableListArgument<
        FlagArgument<VariableListBasicTypes>
    >,
> =
    flagArgument extends VariableListArgument<infer inner>
        ? inner extends StringArgument<string>
            ? string[]
            : inner extends NumberArgument<number>
              ? number[]
              : inner extends BooleanArgument<boolean>
                ? boolean[]
                : inner extends OneOfArgument<infer union>
                  ? readonly union[number][]
                  : "never"
        : never;

type InferListFlagTypeRecursive<
    inner extends readonly FlagArgument<BasicTypes>[],
> = inner extends readonly [infer first, ...infer rest]
    ? first extends StringArgument<string>
        ? rest extends readonly FlagArgument<BasicTypes>[]
            ? [string, ...InferListFlagTypeRecursive<rest>]
            : [string]
        : first extends NumberArgument<number>
          ? rest extends readonly FlagArgument<BasicTypes>[]
              ? [number, ...InferListFlagTypeRecursive<rest>]
              : [number]
          : first extends BooleanArgument<boolean>
            ? rest extends readonly FlagArgument<BasicTypes>[]
                ? [boolean, ...InferListFlagTypeRecursive<rest>]
                : [boolean]
            : []
    : inner extends StringArgument<string>
      ? [string]
      : inner extends NumberArgument<number>
        ? [number]
        : inner extends BooleanArgument<boolean>
          ? [boolean]
          : [];

type InferListFlagType<
    flagArgument extends ListArgument<readonly FlagArgument<BasicTypes>[]>,
> =
    flagArgument extends ListArgument<infer inner>
        ? InferListFlagTypeRecursive<inner>
        : never;

type InferOneOfFlagType<flagArgument extends OneOfArgument<readonly string[]>> =
    flagArgument extends OneOfArgument<infer inner>
        ? inner extends readonly string[]
            ? inner[number]
            : inner
        : never;

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

/**
 * A result from a flag: contains the flag name, if it was present in the arguments,
 * and whether the arguments were parsed as described.
 */
export type FlagResult<
    flagArgument extends FlagArgument<KnownTypes>,
    name extends string,
> = {
    flag: Flag<flagArgument, name>;
    isPresent: boolean;
    arguments: Result<InferFlagArgumentType<flagArgument>>;
};

export type StringArgument<encode extends string> = { kind: "StringArgument" };

/**
 * An argument parser that treats an argument as a string
 */

export function string(): FlagArgument<string> {
    return {
        kind: "StringArgument",
    };
}

export type NumberArgument<encode extends number> = {
    kind: "NumberArgument";
};

/**
 * An argument parser that treats an argument as a number
 */

export function number(): NumberArgument<number> {
    return {
        kind: "NumberArgument",
    };
}

export type BooleanArgument<encode extends boolean> = {
    kind: "BooleanArgument";
};

/**
 * An argument parser that treats an argument as a boolean
 */

export function boolean(): BooleanArgument<boolean> {
    return {
        kind: "BooleanArgument",
    };
}

/**
 * An argument parser that always passes
 */

export function empty(): FlagArgument<true> {
    return {
        kind: "BooleanArgument",
    };
}

export type ListArgument<
    flagTypes extends readonly FlagArgument<BasicTypes>[],
> = {
    kind: "ListArgument";
    items: flagTypes;
};

/**
 * An argument parser that treats an argument as a list
 */

export function list<
    const flagTypes extends readonly FlagArgument<BasicTypes>[],
>(flagArgumentParsers: flagTypes): ListArgument<flagTypes> {
    return {
        kind: "ListArgument",
        items: flagArgumentParsers,
    };
}

export type VariableListArgument<
    flagType extends FlagArgument<VariableListBasicTypes>,
> = {
    kind: "VariableListArgument";
    item: flagType;
};

function VariableListArgument<
    flagType extends FlagArgument<VariableListBasicTypes>,
>(item: flagType): VariableListArgument<flagType> {
    return {
        kind: "VariableListArgument",
        item,
    };
}

/**
 * An argument parser that treats an argument as a list
 */

export function variableList<
    flagType extends FlagArgument<VariableListBasicTypes>,
>(flagArgumentParser: flagType): VariableListArgument<flagType> {
    return VariableListArgument(flagArgumentParser);
}

export type OneOfArgument<encode extends readonly string[]> = {
    kind: "OneOfArgument";
    items: encode;
};

/**
 * An argument parser that treats an argument as an enum
 */

export function oneOf<const encode extends readonly string[]>(
    items: encode,
): OneOfArgument<encode> {
    return {
        kind: "OneOfArgument",
        items,
    };
}

export type Short<
    flagArgument extends FlagArgument<KnownTypes>,
    name extends string,
> = {
    kind: "Short";
    name: name;
    help: string;
    parser: flagArgument;
};

export type Long<
    flagArgument extends FlagArgument<KnownTypes>,
    name extends string,
> = {
    kind: "Long";
    name: name;
    help: string;
    parser: flagArgument;
};

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

export type Flag<
    flagType extends FlagArgument<KnownTypes>,
    name extends string,
> = Short<flagType, name> | Long<flagType, name> | Both<flagType, name>;

/**
 * A short flag, like -y
 */

export function shortFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(name: name, help: string, parser: flagArgument): Short<flagArgument, name> {
    return { kind: "Short", name, help, parser };
}

/**
 * A long flag, like --yes
 */

export function longFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(name: name, help: string, parser: flagArgument): Long<flagArgument, name> {
    return { kind: "Long", name, parser, help };
}

/**
 * A short or long flag, like -y or --yes
 */

export function bothFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(
    shortName: string,
    longName: name,
    help: string,
    parser: flagArgument,
): Both<flagArgument, name> {
    return { kind: "Both", shortName, longName, help, parser };
}

export type InferFlagType<
    x extends Flag<FlagArgument<BaseParseableTypes>, string>,
> = x extends Flag<FlagArgument<infer flagType>, infer name> ? flagType : never;

export type InferFlagName<
    x extends Flag<FlagArgument<BaseParseableTypes>, string>,
> = x extends Flag<infer flagType, infer name> ? name : never;

export type InferFlagResultType<
    x extends FlagResult<FlagArgument<KnownTypes>, string>,
> =
    x extends FlagResult<infer flagArgument, infer name>
        ? InferFlagArgumentType<flagArgument>
        : never;

export type ProgramParser<
    flagTypes extends readonly Flag<FlagArgument<KnownTypes>, string>[],
> = {
    flags: {
        [k in flagTypes[number] as InferFlagName<k>]: k;
    };
};

/**
 * A Program contains all arguments given to it, and an record of all the flags
 */
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

/**
 * Extracted values from a parsed program
 */
export type ProgramValues<
    flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
> = {
    [k in flags[number] as InferFlagName<k>]:
        | InferFlagArgumentType<k["parser"]>
        | undefined;
};

/**
 * Infer a Program from a given parser, e.g:
 * ```
 * function handleFlag(program: ProgramOf<typeof parser>) {}
 * ```
 */
export type ProgramOf<
    parser extends ProgramParser<
        readonly Flag<FlagArgument<KnownTypes>, string>[]
    >,
> = parser extends ProgramParser<infer flags> ? Program<flags> : never;

/**
 * Infer a ProgramValues from a given parser, e.g:
 * ```
 * function handleFlag(yes: ProgramValuesOf<typeof parser>["yes"]) {}
 * ```
 */
export type ProgramValuesOf<
    parser extends ProgramParser<
        readonly Flag<FlagArgument<KnownTypes>, string>[]
    >,
> = parser extends ProgramParser<infer flags> ? ProgramValues<flags> : never;
