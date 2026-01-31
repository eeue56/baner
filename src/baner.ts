import type {
    BaseParseableTypes,
    BasicTypes,
    Both,
    Flag,
    FlagArgument,
    FlagResult,
    InferFlagArgumentType,
    InferFlagName,
    InferFlagType,
    KnownTypes,
    Long,
    Program,
    ProgramParser,
    ProgramValues,
    Result,
    Short,
} from "./types.ts";

import { Err, Ok } from "./types.ts";

/**
 * A parser is composed of an array of flags
 */
export function parser<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(...flags: flags): ProgramParser<flags> {
    const collectedFlags: Partial<ProgramParser<flags>> = {};

    for (const flag of flags) {
        switch (flag.kind) {
            case "Short": {
                (collectedFlags as any)[flag.name] = flag;
                break;
            }
            case "Long": {
                (collectedFlags as any)[flag.name] = flag;
                break;
            }
            case "Both": {
                (collectedFlags as any)[flag.longName] = flag;
                break;
            }
        }
    }
    return { flags: collectedFlags } as ProgramParser<flags>;
}

function isFlag(string: string): boolean {
    const isNumber = isNaN(parseFloat(string));
    if (isNumber) {
        return string.startsWith("-");
    }

    return false;
}

function runString(parseable: readonly string[]): Result<string> {
    if (parseable.length === 0 || isFlag(parseable[0]))
        return Err("Not enough arguments. Expected a string.");
    return Ok(parseable[0]);
}

function runNumber(parseable: readonly string[]): Result<number> {
    if (parseable.length === 0 || isFlag(parseable[0]))
        return Err("Not enough arguments. Expected a number.");

    const parsed = parseFloat(parseable[0]);
    if (isNaN(parsed)) return Err("Not a number argument");
    return Ok(parsed);
}

function runBoolean(parseable: readonly string[]): Result<boolean> {
    if (parseable.length === 0 || isFlag(parseable[0])) {
        return Ok(true);
    }

    const parsed = parseable[0] === "true" || parseable[0] === "false";
    if (!parsed) return Err("Not a boolean argument");

    return Ok(parseable[0] === "true");
}

function runList<
    const flagArguments extends readonly FlagArgument<BasicTypes>[],
>(
    flagArguments: flagArguments,
    parseable: readonly string[],
): Result<readonly InferFlagArgumentType<flagArguments[number]>[]> {
    const results: InferFlagArgumentType<flagArguments[number]>[] =
        [] as InferFlagArgumentType<flagArguments[number]>[];

    for (var i = 0; i < flagArguments.length; i++) {
        const argument = flagArguments[i];

        const res = runArgument(argument, parseable.slice(i)) as Result<
            InferFlagArgumentType<flagArguments[number]>
        >;

        if (res.kind === "Err") {
            if (i >= parseable.length || isFlag(parseable[i])) {
                return Err(`${res.error} at index ${i}`);
            }

            return res;
        } else {
            results.push(res.value);
        }
    }

    return Ok(results);
}

function runOneOf(
    items: readonly string[],
    parseable: readonly string[],
): Result<BaseParseableTypes> {
    if (parseable.length === 0 || isFlag(parseable[0]))
        return Err(
            `Not enough arguments. Expected one of: ${items.join(" | ")}.`,
        );

    for (var i = 0; i < items.length; i++) {
        const item = items[i];
        if (item === parseable[0]) return Ok(item);
    }

    return Err(`Didn't match any of: ${items.join(" | ")}`);
}

function runVariableList<flagType extends BaseParseableTypes>(
    flagArgument: FlagArgument<flagType>,
    parseable: readonly string[],
): Result<readonly flagType[]> {
    const results: flagType[] = [];

    for (var i = 0; i < parseable.length; i++) {
        if (isFlag(parseable[i])) break;

        const res = runArgument(flagArgument, parseable.slice(i));

        if (res.kind === "Err") return res;
        results.push(res.value as flagType);
    }

    return Ok(results);
}

function runArgument<const flagType extends FlagArgument<KnownTypes>>(
    argument: flagType,
    parseable: readonly string[],
): Result<InferFlagArgumentType<flagType>> {
    switch (argument.kind) {
        case "StringArgument": {
            return runString(parseable) as Result<
                InferFlagArgumentType<flagType>
            >;
        }
        case "NumberArgument": {
            return runNumber(parseable) as Result<
                InferFlagArgumentType<flagType>
            >;
        }
        case "BooleanArgument": {
            return runBoolean(parseable) as Result<
                InferFlagArgumentType<flagType>
            >;
        }
        case "ListArgument": {
            return runList(argument.items, parseable) as Result<
                InferFlagArgumentType<flagType>
            >;
        }
        case "VariableListArgument": {
            return runVariableList(argument.item, parseable) as Result<
                InferFlagArgumentType<flagType>
            >;
        }
        case "OneOfArgument": {
            return runOneOf(argument.items, parseable) as Result<
                InferFlagArgumentType<flagType>
            >;
        }
    }
}

function runShortFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(
    flag: Short<flagArgument, name>,
    parseable: readonly string[],
): FlagResult<flagArgument, name> {
    const flagName: name = flag.name;
    const innerParser: flagArgument = flag.parser;

    if (parseable.length === 0) {
        return {
            isPresent: false,
            arguments: Err(`Short flag -${flagName} not found`),
            flag: flag,
        };
    }

    for (var i = 0; i < parseable.length; i++) {
        const value = parseable[i];
        if (value === `-${flagName}`) {
            let res = runArgument(innerParser, parseable.slice(i + 1));

            if (res.kind === "Err") {
                res = Err(`Error parsing -${flagName} due to: ${res.error}`);
            }

            return {
                isPresent: true,
                arguments: res as Result<InferFlagArgumentType<flagArgument>>,
                flag: flag,
            };
        }
    }

    return {
        isPresent: false,
        arguments: Err(`Short flag -${flagName} not found`),
        flag: flag,
    };
}

function runLongFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(
    flag: Long<flagArgument, name>,
    parseable: readonly string[],
): FlagResult<flagArgument, name> {
    const flagName: name = flag.name;
    const innerParser: flagArgument = flag.parser;

    if (parseable.length === 0) {
        return {
            isPresent: false,
            arguments: Err(`Long flag --${flagName} not found`),
            flag,
        };
    }

    for (var i = 0; i < parseable.length; i++) {
        const value = parseable[i];
        if (value === `--${flagName}`) {
            let res = runArgument(innerParser, parseable.slice(i + 1));

            if (res.kind === "Err") {
                res = Err(`Error parsing --${flagName} due to: ${res.error}`);
            }

            return {
                isPresent: true,
                arguments: res as Result<InferFlagArgumentType<flagArgument>>,
                flag,
            };
        }
    }

    return {
        isPresent: false,
        arguments: Err(`Long flag --${flagName} not found`),
        flag,
    };
}

function runBothFlag<
    const flagArgument extends FlagArgument<KnownTypes>,
    const name extends string,
>(
    flag: Both<flagArgument, name>,
    parseable: readonly string[],
): FlagResult<flagArgument, name> {
    const shortFlagName = flag.shortName;
    const longFlagName = flag.longName;
    const innerParser: flagArgument = flag.parser;

    const combinedFlagName = `-${shortFlagName}/--${longFlagName}`;

    if (parseable.length === 0) {
        return {
            isPresent: false,
            arguments: Err(`Mixed flag ${combinedFlagName} not found`),
            flag,
        };
    }

    for (var i = 0; i < parseable.length; i++) {
        const value = parseable[i];
        if (value === `-${shortFlagName}` || value === `--${longFlagName}`) {
            let res = runArgument(innerParser, parseable.slice(i + 1));

            if (res.kind === "Err") {
                res = Err(
                    `Error parsing ${combinedFlagName} due to: ${res.error}`,
                );
            }

            return {
                isPresent: true,
                arguments: res as Result<InferFlagArgumentType<flagArgument>>,
                flag,
            };
        }
    }

    return {
        isPresent: false,
        arguments: Err(`Mixed flag ${combinedFlagName} not found`),
        flag,
    };
}

function runParser<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(
    programParser: ProgramParser<flags>,
    parseable: readonly string[],
): Program<flags> {
    const emptyRecord: Program<flags> = {
        args: parseable,
        flags: {} as any,
    };

    for (const flag of Object.values(programParser.flags) as flags[number][]) {
        let res;

        switch (flag.kind) {
            case "Short": {
                res = runShortFlag(flag, parseable);
                break;
            }
            case "Long": {
                res = runLongFlag(flag, parseable);
                break;
            }
            case "Both": {
                res = runBothFlag(flag, parseable);
            }
        }

        let name: InferFlagName<flags[number]>;

        switch (flag.kind) {
            case "Short": {
                name = flag.name as InferFlagName<flags[number]>;
                break;
            }
            case "Long": {
                name = flag.name as InferFlagName<flags[number]>;
                break;
            }
            case "Both": {
                name = flag.longName as InferFlagName<flags[number]>;
                break;
            }
        }

        (emptyRecord.flags as any)[name] = {
            isPresent: res.isPresent,
            arguments: res.arguments as Result<InferFlagType<flags[number]>>,
            flag,
        };
    }

    return emptyRecord;
}

function helpFlagArgumentParser<
    const flagArgument extends FlagArgument<KnownTypes>,
>(parser: flagArgument): string {
    switch (parser.kind) {
        case "BooleanArgument":
            return "boolean";
        case "NumberArgument":
            return "number";
        case "StringArgument":
            return "string";
        case "ListArgument":
            return (
                "[" + parser.items.map(helpFlagArgumentParser).join(" ") + "]"
            );
        case "VariableListArgument":
            return "[" + helpFlagArgumentParser(parser.item) + "...]";
        case "OneOfArgument":
            return parser.items.join(" | ");
    }
}

/**
 * Creates a help text for a given program parser
 */
export function help<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(flagParser: ProgramParser<flags>): string {
    const output: string[] = [];
    for (const flag of Object.values(flagParser.flags) as flags[number][]) {
        switch (flag.kind) {
            case "Short": {
                output.push(
                    `  -${flag.name} ${helpFlagArgumentParser(
                        flag.parser,
                    )}:\t\t${flag.help}`,
                );
                break;
            }
            case "Long": {
                output.push(
                    `  --${flag.name} ${helpFlagArgumentParser(
                        flag.parser,
                    )}:\t\t${flag.help}`,
                );
                break;
            }
            case "Both": {
                output.push(
                    `  -${flag.shortName}, --${
                        flag.longName
                    } ${helpFlagArgumentParser(flag.parser)}:\t\t${flag.help}`,
                );
                break;
            }
        }
    }

    return output.join("\n");
}

/**
 * Reports all errors in a program, ignoring missing flags.
 */
export function allErrors<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(program: Program<flags>): string[] {
    const errors: string[] = [];

    Object.keys(program.flags).map((key) => {
        if (!(program.flags as any)[key].isPresent) return;
        const argument = (program.flags as any)[key].arguments;
        if (argument.kind === "Err") {
            errors.push(argument.error);
        }
    });

    return errors;
}

/**
 * Reports missing flags, ignoring the ones you don't care about.
 */
export function allMissing<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(program: Program<flags>, ignore: string[]): string[] {
    const errors: string[] = [];

    for (const key of Object.keys(program.flags)) {
        if (ignore.indexOf(key) > -1) continue;
        if (!(program.flags as any)[key].isPresent) errors.push(key);
    }

    return errors;
}

/**
 * Gets the Ok values out of the program as the raw type (i.e a `string` from `string()`)
 */
export function allValues<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(program: Program<flags>): ProgramValues<flags> {
    const values: Partial<ProgramValues<flags>> = {};

    for (const key of Object.keys(program.flags)) {
        if (!(program.flags as any)[key].isPresent) continue;
        const argument = (program.flags as any)[key].arguments;
        if (argument.kind === "Ok") {
            values[key as keyof ProgramValues<flags>] = argument.value;
        } else {
            values[key as keyof ProgramValues<flags>] = undefined;
        }
    }

    return values as unknown as ProgramValues<flags>;
}

/**
 * Runs a flag parser on the args
 */
export function parse<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(flagParser: ProgramParser<flags>, args: string[]): Program<flags> {
    const parseable: string[] = [];

    for (const arg of args) {
        if (arg.indexOf("=") > -1) {
            parseable.push(arg.split("=")[0]);

            arg.split("=")[1]
                .split(",")
                .forEach((splitArg) => {
                    parseable.push(splitArg);
                });
        } else {
            arg.split(",").forEach((splitArg) => {
                parseable.push(splitArg);
            });
        }
    }

    const res = runParser(flagParser, parseable);
    return res;
}

export * from "./types.ts";
