import { Err, Ok, Result } from "@eeue56/ts-core/build/main/lib/result";

/**
 * A result from a flag: contains the flag name, if it was present in the arguments,
 * and whether the arguments were parsed as described.
 */
type FlagResult = {
    name: string;
    isPresent: boolean;
    arguments: Result<string, KnownTypes>;
};

export type StringArgument = {
    kind: "StringArgument";
};

function StringArgument(): StringArgument {
    return {
        kind: "StringArgument",
    };
}

/**
 * An argument parser that treats an argument as a string
 */
export function string(): FlagArgument {
    return StringArgument();
}

export type NumberArgument = {
    kind: "NumberArgument";
};

function NumberArgument(): NumberArgument {
    return {
        kind: "NumberArgument",
    };
}

/**
 * An argument parser that treats an argument as a number
 */
export function number(): FlagArgument {
    return NumberArgument();
}

export type BooleanArgument = {
    kind: "BooleanArgument";
};

function BooleanArgument(): BooleanArgument {
    return {
        kind: "BooleanArgument",
    };
}

/**
 * An argument parser that treats an argument as a boolean
 */
export function boolean(): FlagArgument {
    return BooleanArgument();
}

export type EmptyArgument = {
    kind: "EmptyArgument";
};

function EmptyArgument(): EmptyArgument {
    return {
        kind: "EmptyArgument",
    };
}

/**
 * An argument parser that always passes
 */
export function empty(): FlagArgument {
    return EmptyArgument();
}

export type ListArgument = {
    kind: "ListArgument";
    items: FlagArgument[];
};

function ListArgument(items: FlagArgument[]): ListArgument {
    return {
        kind: "ListArgument",
        items,
    };
}

/**
 * An argument parser that treats an argument as a list
 */
export function list(flagArgumentParsers: FlagArgument[]): FlagArgument {
    return ListArgument(flagArgumentParsers);
}

export type VariableListArgument = {
    kind: "VariableListArgument";
    item: FlagArgument;
};

function VariableListArgument(item: FlagArgument): VariableListArgument {
    return {
        kind: "VariableListArgument",
        item,
    };
}

/**
 * An argument parser that treats an argument as an enum
 */
export function oneOf(items: string[]): FlagArgument {
    return OneOfArgument(items);
}

export type OneOfArgument = {
    kind: "OneOfArgument";
    items: string[];
};

function OneOfArgument(items: string[]): OneOfArgument {
    return {
        kind: "OneOfArgument",
        items,
    };
}

/**
 * An argument parser that treats an argument as a list
 */
export function variableList(flagArgumentParser: FlagArgument): FlagArgument {
    return VariableListArgument(flagArgumentParser);
}

type KnownTypes = string | number | boolean | null | KnownTypes[];

export type FlagArgument =
    | StringArgument
    | NumberArgument
    | BooleanArgument
    | EmptyArgument
    | ListArgument
    | VariableListArgument
    | OneOfArgument;

export type Short = {
    kind: "Short";
    name: string;
    help: string;
    parser: FlagArgument;
};

function Short(name: string, help: string, parser: FlagArgument): Short {
    return {
        kind: "Short",
        name,
        help,
        parser,
    };
}

export type Long = {
    kind: "Long";
    name: string;
    help: string;
    parser: FlagArgument;
};

function Long(name: string, help: string, parser: FlagArgument): Long {
    return {
        kind: "Long",
        name,
        help,
        parser,
    };
}

export type Both = {
    kind: "Both";
    shortName: string;
    longName: string;
    help: string;
    parser: FlagArgument;
};

function Both(
    shortName: string,
    longName: string,
    help: string,
    parser: FlagArgument
): Both {
    return {
        kind: "Both",
        shortName,
        longName,
        help,
        parser,
    };
}

export type Flag = Short | Long | Both;

/**
 * A short flag, like -y
 */
export function shortFlag(name: string, help: string, parser: FlagArgument) {
    return Short(name, help, parser);
}

/**
 * A long flag, like --yes
 */
export function longFlag(name: string, help: string, parser: FlagArgument) {
    return Long(name, help, parser);
}

/**
 * A short or long flag, like -y or --yes
 */
export function bothFlag(
    shortName: string,
    longName: string,
    help: string,
    parser: FlagArgument
) {
    return Both(shortName, longName, help, parser);
}

/**
 * A program parser is composed of an array of flags
 */
export type ProgramParser = {
    flags: Flag[];
};

/**
 * A parser is composed of an array of flags
 */
export function parser(flags: Flag[]): ProgramParser {
    return {
        flags,
    };
}

/**
 * A Program contains all arguments given to it, and an record of all the flags
 */
export type Program = {
    args: string[];
    flags: Record<
        string,
        {
            isPresent: boolean;
            arguments: Result<string, KnownTypes>;
        }
    >;
};

function isFlag(string: string) {
    const isNumber = isNaN(parseFloat(string));
    if (isNumber) {
        return string.startsWith("-");
    }

    return false;
}

function runEmpty(parseable: string[]): Result<string, null> {
    return Ok(null);
}

function runString(parseable: string[]): Result<string, string> {
    if (parseable.length === 0 || isFlag(parseable[0]))
        return Err("Not enough arguments. Expected a string.");
    return Ok(parseable[0]);
}

function runNumber(parseable: string[]): Result<string, number> {
    if (parseable.length === 0 || isFlag(parseable[0]))
        return Err("Not enough arguments. Expected a number.");

    const parsed = parseFloat(parseable[0]);
    if (isNaN(parsed)) return Err("Not a number argument");
    return Ok(parsed);
}

function runBoolean(parseable: string[]): Result<string, boolean> {
    if (parseable.length === 0 || isFlag(parseable[0]))
        return Err("Not enough arguments. Expected a boolean.");

    const parsed = parseable[0] === "true" || parseable[0] === "false";
    if (!parsed) return Err("Not a boolean argument");

    return Ok(parseable[0] === "true");
}

function runList(
    flagArguments: FlagArgument[],
    parseable: string[]
): Result<string, KnownTypes[]> {
    const results = [ ];

    for (var i = 0; i < flagArguments.length; i++) {
        const argument = flagArguments[i];

        const res = runArgument(argument, parseable.slice(i));

        if (res.kind === "err") {
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
    items: string[],
    parseable: string[]
): Result<string, KnownTypes> {
    if (parseable.length === 0 || isFlag(parseable[0]))
        return Err(
            `Not enough arguments. Expected one of: ${items.join(" | ")}.`
        );

    for (var i = 0; i < items.length; i++) {
        const item = items[i];
        if (item === parseable[0]) return Ok(item);
    }

    return Err(`Didn't match any of: ${items.join(" | ")}`);
}

function runVariableList(
    flagArgument: FlagArgument,
    parseable: string[]
): Result<string, KnownTypes[]> {
    const results = [ ];

    for (var i = 0; i < parseable.length; i++) {
        if (isFlag(parseable[i])) break;

        const res = runArgument(flagArgument, parseable.slice(i));

        if (res.kind === "err") return res;
        results.push(res.value);
    }

    return Ok(results);
}

function runArgument(
    argument: FlagArgument,
    parseable: string[]
): Result<string, KnownTypes> {
    switch (argument.kind) {
        case "StringArgument": {
            return runString(parseable);
        }
        case "NumberArgument": {
            return runNumber(parseable);
        }
        case "BooleanArgument": {
            return runBoolean(parseable);
        }
        case "EmptyArgument": {
            return runEmpty(parseable);
        }
        case "ListArgument": {
            return runList(argument.items, parseable);
        }
        case "VariableListArgument": {
            return runVariableList(argument.item, parseable);
        }
        case "OneOfArgument": {
            return runOneOf(argument.items, parseable);
        }
    }
}

function runShortFlag(
    flagName: string,
    innerParser: FlagArgument,
    parseable: string[]
): FlagResult {
    if (parseable.length === 0) {
        return {
            name: flagName,
            isPresent: false,
            arguments: Err(`Short flag -${flagName} not found`),
        };
    }

    for (var i = 0; i < parseable.length; i++) {
        const value = parseable[i];
        if (value === `-${flagName}`) {
            let res = runArgument(innerParser, parseable.slice(i + 1));

            if (res.kind === "err") {
                res = Err(`Error parsing -${flagName} due to: ${res.error}`);
            }

            return {
                name: flagName,
                isPresent: true,
                arguments: res,
            };
        }
    }

    return {
        name: flagName,
        isPresent: false,
        arguments: Err(`Short flag -${flagName} not found`),
    };
}

function runLongFlag<a>(
    flagName: string,
    innerParser: FlagArgument,
    parseable: string[]
): FlagResult {
    if (parseable.length === 0) {
        return {
            name: flagName,
            isPresent: false,
            arguments: Err(`Long flag --${flagName} not found`),
        };
    }

    for (var i = 0; i < parseable.length; i++) {
        const value = parseable[i];
        if (value === `--${flagName}`) {
            let res = runArgument(innerParser, parseable.slice(i + 1));

            if (res.kind === "err") {
                res = Err(`Error parsing --${flagName} due to: ${res.error}`);
            }

            return {
                name: flagName,
                isPresent: true,
                arguments: res,
            };
        }
    }

    return {
        name: flagName,
        isPresent: false,
        arguments: Err(`Long flag --${flagName} not found`),
    };
}

function runBothFlag(
    shortFlagName: string,
    longFlagName: string,
    innerParser: FlagArgument,
    parseable: string[]
): FlagResult {
    const combinedFlagName = shortFlagName + "/" + longFlagName;

    if (parseable.length === 0) {
        return {
            name: combinedFlagName,
            isPresent: false,
            arguments: Err(
                `Mixed flag -${shortFlagName}/--${longFlagName} not found`
            ),
        };
    }

    for (var i = 0; i < parseable.length; i++) {
        const value = parseable[i];
        if (value === `-${shortFlagName}` || value === `--${longFlagName}`) {
            let res = runArgument(innerParser, parseable.slice(i + 1));

            if (res.kind === "err") {
                res = Err(
                    `Error parsing -${shortFlag}/--${longFlagName} due to: ${res.error}`
                );
            }

            return {
                name: combinedFlagName,
                isPresent: true,
                arguments: res,
            };
        }
    }

    return {
        name: combinedFlagName,
        isPresent: false,
        arguments: Err(
            `Mixed flag -${shortFlagName}/--${longFlagName} not found`
        ),
    };
}

function runParser(programParser: ProgramParser, parseable: string[]): Program {
    const emptyRecord: Record<
        string,
        {
            isPresent: boolean;
            arguments: Result<string, KnownTypes>;
        }
    > = {};

    for (var i = 0; i < programParser.flags.length; i++) {
        const flag = programParser.flags[i];
        let res;

        switch (flag.kind) {
            case "Short": {
                res = runShortFlag(flag.name, flag.parser, parseable);
                break;
            }
            case "Long": {
                res = runLongFlag(flag.name, flag.parser, parseable);
                break;
            }
            case "Both": {
                const bothFlag = flag as Both;
                res = runBothFlag(
                    bothFlag.shortName,
                    bothFlag.longName,
                    bothFlag.parser,
                    parseable
                );
            }
        }

        let name;

        switch (flag.kind) {
            case "Short": {
                name = flag.name;
                break;
            }
            case "Long": {
                name = flag.name;
                break;
            }
            case "Both": {
                const bothFlag = flag as Both;
                name = bothFlag.shortName + "/" + bothFlag.longName;
            }
        }

        emptyRecord[name] = {
            isPresent: res.isPresent,
            arguments: res.arguments,
        };
    }

    return {
        args: parseable,
        flags: emptyRecord,
    };
}

function helpFlagArgumentParser(parser: FlagArgument): string {
    switch (parser.kind) {
        case "BooleanArgument":
            return "boolean";
        case "NumberArgument":
            return "number";
        case "StringArgument":
            return "string";
        case "EmptyArgument":
            return "";
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
export function help(flagParser: ProgramParser): string {
    return flagParser.flags
        .map((flag: Flag) => {
            switch (flag.kind) {
                case "Short": {
                    return `  -${flag.name} ${helpFlagArgumentParser(
                        flag.parser
                    )}:\t\t${flag.help}`;
                }
                case "Long": {
                    return `  --${flag.name} ${helpFlagArgumentParser(
                        flag.parser
                    )}:\t\t${flag.help}`;
                }
                case "Both": {
                    return `  -${flag.shortName}, --${
                        flag.longName
                    } ${helpFlagArgumentParser(flag.parser)}:\t\t${flag.help}`;
                }
            }
        })
        .join("\n");
}

/**
 * Reports all errors in a program, ignoring missing flags.
 */
export function allErrors(program: Program): string[] {
    const errors: string[] = [ ];

    Object.keys(program.flags).map((key) => {
        if (!program.flags[key].isPresent) return;
        const argument = program.flags[key].arguments;
        if (argument.kind === "err") {
            errors.push(argument.error);
        }
    });

    return errors;
}

/**
 * Reports missing flags, ignoring the ones you don't care about.
 */
export function allMissing(program: Program, ignore: string[]): string[] {
    const errors: string[] = [ ];

    Object.keys(program.flags).map((key) => {
        if (ignore.indexOf(key) > -1) return;
        if (!program.flags[key].isPresent) errors.push(key);
    });

    return errors;
}

/**
 * Runs a flag parser on the args
 */
export function parse(flagParser: ProgramParser, args: string[]): Program {
    const parseable: string[] = [ ];

    args.forEach((arg) => {
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
    });

    const res = runParser(flagParser, parseable);
    return res;
}
