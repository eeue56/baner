import * as assert from "assert";
import { allErrors, allMissing, parse, parser } from "./baner.ts";
import {
    boolean,
    bothFlag,
    empty,
    Err,
    list,
    longFlag,
    number,
    Ok,
    oneOf,
    shortFlag,
    string,
    variableList,
} from "./types.ts";

import type { Result } from "./types.ts";

/**
 * https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message
 */
export function deepStrictEqual<t>(
    actual: t,
    expected: t,
    message?: string | Error,
): void {
    return assert.deepStrictEqual(actual, expected, message);
}

export function testShortFlag() {
    const flagParser = shortFlag("a", "some help text", empty());
    const emptyAParser = parser(flagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(emptyAParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<boolean>,
                flag: flagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["-a"];

    deepStrictEqual(parse(emptyAParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["-a"],
    });

    const listWithMultipleFlags: string[] = ["-a", "-b", "-c"];

    deepStrictEqual(parse(emptyAParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["-a", "-b", "-c"],
    });

    const listWithMultiplebothFlags: string[] = [
        "--yes",
        "-c",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(emptyAParser, listWithMultiplebothFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["--yes", "-c", "-a", "--no", "-b"],
    });
}

export function testShortFlagWithSingleArgument() {
    const flagParser = shortFlag("a", "some help text", list([string()]));
    const singleArgParser = parser(flagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<[string]>,
                flag: flagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["-a"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err(
                    "Error parsing -a due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: flagParser,
            },
        },
        args: ["-a"],
    });

    const listWithSingleFlagWithArgument: string[] = ["-a", "hello"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlagWithArgument), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(["hello"] as [string]),
                flag: flagParser,
            },
        },
        args: ["-a", "hello"],
    });

    const listWithMultipleFlags: string[] = ["-a", "hello", "-b", "-c"];

    deepStrictEqual(parse(singleArgParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(["hello"] as [string]),
                flag: flagParser,
            },
        },
        args: ["-a", "hello", "-b", "-c"],
    });

    const listWithMultipleFlagsWithoutArgument: string[] = ["-a", "-b", "-c"];

    deepStrictEqual(
        parse(singleArgParser, listWithMultipleFlagsWithoutArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Err(
                        "Error parsing -a due to: Not enough arguments. Expected a string. at index 0",
                    ) as Result<[string]>,
                    flag: flagParser,
                },
            },
            args: ["-a", "-b", "-c"],
        },
    );

    const listWithMultiplebothFlags: string[] = [
        "--yes",
        "-c",
        "-a",
        "hello",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(singleArgParser, listWithMultiplebothFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(["hello"] as [string]),
                flag: flagParser,
            },
        },
        args: ["--yes", "-c", "-a", "hello", "--no", "-b"],
    });
}

export function testLongFlag() {
    const flagParser = longFlag("yes", "some help text", empty());
    const emptyYesParser = parser(flagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(emptyYesParser, emptyList), {
        flags: {
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found") as Result<boolean>,
                flag: flagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["--yes"];

    deepStrictEqual(parse(emptyYesParser, listWithSingleFlag), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["--yes"],
    });

    const listWithMultipleFlags: string[] = ["--yes", "-b", "-c"];

    deepStrictEqual(parse(emptyYesParser, listWithMultipleFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["--yes", "-b", "-c"],
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(emptyYesParser, listWithMultiplebothFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["-c", "--yes", "-a", "--no", "-b"],
    });
}

export function testLongFlagWithSingleArgument() {
    const flagParser = longFlag("yes", "some help text", list([string()]));
    const singleArgParser = parser(flagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found") as Result<[string]>,
                flag: flagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["--yes"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Err(
                    "Error parsing --yes due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: flagParser,
            },
        },
        args: ["--yes"],
    });

    const listWithMultipleFlags: string[] = ["--yes", "-b", "-c"];

    deepStrictEqual(parse(singleArgParser, listWithMultipleFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Err(
                    "Error parsing --yes due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: flagParser,
            },
        },
        args: ["--yes", "-b", "-c"],
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(singleArgParser, listWithMultiplebothFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Err(
                    "Error parsing --yes due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: flagParser,
            },
        },
        args: ["-c", "--yes", "-a", "--no", "-b"],
    });

    const listWithMultiplebothFlagsAndAnArg: string[] = [
        "-c",
        "--yes",
        "hello",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(singleArgParser, listWithMultiplebothFlagsAndAnArg), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(["hello"] as [string]),
                flag: flagParser,
            },
        },
        args: ["-c", "--yes", "hello", "-a", "--no", "-b"],
    });
}

export function testBothFlag() {
    const flagParser = bothFlag("y", "yes", "some help text", empty());
    const emptyYesParser = parser(flagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(emptyYesParser, emptyList), {
        flags: {
            yes: {
                isPresent: false,
                arguments: Err(
                    "Mixed flag -y/--yes not found",
                ) as Result<boolean>,
                flag: flagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["--yes"];

    deepStrictEqual(parse(emptyYesParser, listWithSingleFlag), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["--yes"],
    });

    const listWithMultipleFlags: string[] = ["--yes", "-b", "-c"];

    deepStrictEqual(parse(emptyYesParser, listWithMultipleFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["--yes", "-b", "-c"],
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(emptyYesParser, listWithMultiplebothFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: flagParser,
            },
        },
        args: ["-c", "--yes", "-a", "--no", "-b"],
    });

    const listWithMultiplebothFlagsAndShortFlag: string[] = [
        "-c",
        "-y",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(
        parse(emptyYesParser, listWithMultiplebothFlagsAndShortFlag),
        {
            flags: {
                yes: {
                    isPresent: true,
                    arguments: Ok(true),
                    flag: flagParser,
                },
            },
            args: listWithMultiplebothFlagsAndShortFlag,
        },
    );
}

export function testMultipleEmptyArguments() {
    const shortFlagParser = shortFlag("a", "some help text", empty());
    const longFlagParser = longFlag("yes", "some help text", empty());
    const emptyAOrYesParser = parser(
        shortFlag("a", "some help text", empty()),
        longFlag("yes", "some help text", empty()),
    );

    const emptyList: string[] = [];

    deepStrictEqual(parse(emptyAOrYesParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<boolean>,
                flag: shortFlagParser,
            },
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found") as Result<boolean>,
                flag: longFlagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["--yes"];

    deepStrictEqual(parse(emptyAOrYesParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<boolean>,
                flag: shortFlagParser,
            },
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: longFlagParser,
            },
        },
        args: ["--yes"],
    });

    const listWithMultipleFlags: string[] = ["--yes", "-b", "-c"];

    deepStrictEqual(parse(emptyAOrYesParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<boolean>,
                flag: shortFlagParser,
            },
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: longFlagParser,
            },
        },
        args: listWithMultipleFlags,
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(emptyAOrYesParser, listWithMultiplebothFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(true),
                flag: shortFlagParser,
            },
            yes: {
                isPresent: true,
                arguments: Ok(true),
                flag: longFlagParser,
            },
        },
        args: listWithMultiplebothFlags,
    });

    const listWithMultiplebothFlagsInDifferentOrder: string[] = [
        "-c",
        "-a",
        "--no",
        "--yes",
        "-b",
    ];

    deepStrictEqual(
        parse(emptyAOrYesParser, listWithMultiplebothFlagsInDifferentOrder),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok(true),
                    flag: shortFlagParser,
                },
                yes: {
                    isPresent: true,
                    arguments: Ok(true),
                    flag: longFlagParser,
                },
            },
            args: listWithMultiplebothFlagsInDifferentOrder,
        },
    );
}

export function testMultipleSingleArguments() {
    const shortFlagParser = shortFlag("a", "some help text", list([string()]));
    const longFlagParser = longFlag("yes", "some help text", list([string()]));
    const emptyAOrYesParser = parser(shortFlagParser, longFlagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(emptyAOrYesParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<[string]>,
                flag: shortFlagParser,
            },
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found") as Result<[string]>,
                flag: longFlagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["--yes"];

    deepStrictEqual(parse(emptyAOrYesParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<[string]>,
                flag: shortFlagParser,
            },
            yes: {
                isPresent: true,
                arguments: Err(
                    "Error parsing --yes due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: longFlagParser,
            },
        },
        args: ["--yes"],
    });

    const listWithMultipleFlags: string[] = ["--yes", "-b", "-c"];

    deepStrictEqual(parse(emptyAOrYesParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<[string]>,
                flag: shortFlagParser,
            },
            yes: {
                isPresent: true,
                arguments: Err(
                    "Error parsing --yes due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: longFlagParser,
            },
        },
        args: listWithMultipleFlags,
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    deepStrictEqual(parse(emptyAOrYesParser, listWithMultiplebothFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err(
                    "Error parsing -a due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: shortFlagParser,
            },
            yes: {
                isPresent: true,
                arguments: Err(
                    "Error parsing --yes due to: Not enough arguments. Expected a string. at index 0",
                ) as Result<[string]>,
                flag: longFlagParser,
            },
        },
        args: listWithMultiplebothFlags,
    });

    const listWithMultiplebothFlagsInDifferentOrder: string[] = [
        "-c",
        "-a",
        "--no",
        "--yes",
        "-b",
    ];

    deepStrictEqual(
        parse(emptyAOrYesParser, listWithMultiplebothFlagsInDifferentOrder),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Err(
                        "Error parsing -a due to: Not enough arguments. Expected a string. at index 0",
                    ) as Result<[string]>,
                    flag: shortFlagParser,
                },
                yes: {
                    isPresent: true,
                    arguments: Err(
                        "Error parsing --yes due to: Not enough arguments. Expected a string. at index 0",
                    ) as Result<[string]>,
                    flag: longFlagParser,
                },
            },
            args: listWithMultiplebothFlagsInDifferentOrder,
        },
    );
}

export function testShortFlagWithSingleNumberArgument() {
    const shortFlagParser = shortFlag("a", "some help text", list([number()]));
    const singleArgParser = parser(shortFlagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<[number]>,
                flag: shortFlagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["-a"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err(
                    "Error parsing -a due to: Not enough arguments. Expected a number. at index 0",
                ) as Result<[number]>,
                flag: shortFlagParser,
            },
        },
        args: ["-a"],
    });

    const listWithSingleFlagWithArgument: string[] = ["-a", "hello"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlagWithArgument), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err(
                    "Error parsing -a due to: Not a number argument",
                ) as Result<[number]>,
                flag: shortFlagParser,
            },
        },
        args: listWithSingleFlagWithArgument,
    });

    const listWithSingleFlagWithNumberArgument: string[] = ["-a", "5.5"];

    deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithNumberArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([5.5] as [number]),
                    flag: shortFlagParser,
                },
            },
            args: listWithSingleFlagWithNumberArgument,
        },
    );

    const listWithSingleFlagWithIntArgument: string[] = ["-a", "5"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlagWithIntArgument), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([5] as [number]),
                flag: shortFlagParser,
            },
        },
        args: listWithSingleFlagWithIntArgument,
    });

    const listWithSingleFlagWithZeroArgument: string[] = ["-a", "0"];

    deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithZeroArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([0] as [number]),
                    flag: shortFlagParser,
                },
            },
            args: listWithSingleFlagWithZeroArgument,
        },
    );

    const listWithSingleFlagWithNegativeArgument: string[] = ["-a", "-5.5"];

    deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithNegativeArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([-5.5] as [number]),
                    flag: shortFlagParser,
                },
            },
            args: listWithSingleFlagWithNegativeArgument,
        },
    );
}

export function testShortFlagWithSingleBooleanArgument() {
    const shortFlagParser = shortFlag("a", "some help text", list([boolean()]));
    const singleArgParser = parser(shortFlagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<[boolean]>,
                flag: shortFlagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["-a"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([true] as [boolean]),
                flag: shortFlagParser,
            },
        },
        args: ["-a"],
    });

    const listWithSingleFlagWithArgument: string[] = ["-a", "hello"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlagWithArgument), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err(
                    "Error parsing -a due to: Not a boolean argument",
                ) as Result<[boolean]>,
                flag: shortFlagParser,
            },
        },
        args: listWithSingleFlagWithArgument,
    });

    const listWithSingleFlagWithTrueArgument: string[] = ["-a", "true"];

    deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithTrueArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([true] as [boolean]),
                    flag: shortFlagParser,
                },
            },
            args: listWithSingleFlagWithTrueArgument,
        },
    );

    const listWithSingleFlagWithFalseArgument: string[] = ["-a", "false"];

    deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithFalseArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([false] as [boolean]),
                    flag: shortFlagParser,
                },
            },
            args: listWithSingleFlagWithFalseArgument,
        },
    );
}

export function testShortFlagWithMultipleArguments() {
    const shortFlagParser = shortFlag(
        "a",
        "some help text",
        list([boolean(), string()]),
    );
    const singleArgParser = parser(shortFlagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<
                    [boolean, string]
                >,
                flag: shortFlagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["-a"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err(
                    "Error parsing -a due to: Not enough arguments. Expected a string. at index 1",
                ) as Result<[boolean, string]>,
                flag: shortFlagParser,
            },
        },
        args: ["-a"],
    });

    const listWithSingleFlagWithArgument: string[] = ["-a", "true", "hello"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlagWithArgument), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([true, "hello"] as [boolean, string]),
                flag: shortFlagParser,
            },
        },
        args: listWithSingleFlagWithArgument,
    });
}

export function testShortFlagWithVariableArguments() {
    const flagParser = shortFlag("a", "some help text", variableList(string()));
    const singleArgParser = parser(flagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<string[]>,
                flag: flagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["-a"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([] as string[]),
                flag: flagParser,
            },
        },
        args: ["-a"],
    });

    const listWithSingleFlagWithArgument: string[] = ["-a", "true", "hello"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlagWithArgument), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(["true", "hello"] as string[]),
                flag: flagParser,
            },
        },
        args: listWithSingleFlagWithArgument,
    });
}

export function testShortFlagWithVariableArgumentsOneOf() {
    const flagParser = shortFlag(
        "a",
        "some help text",
        variableList(oneOf(["fish", "frog"])),
    );
    const singleArgParser = parser(flagParser);

    const emptyList: string[] = [];

    deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found") as Result<
                    ("fish" | "frog")[]
                >,
                flag: flagParser,
            },
        },
        args: [],
    });

    const listWithSingleFlag: string[] = ["-a"];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([]),
                flag: flagParser,
            },
        },
        args: ["-a"],
    });

    const listWithSingleFlagWithArgument: string[] = [
        "-a",
        "fish",
        "frog",
        "frog",
    ];

    deepStrictEqual(parse(singleArgParser, listWithSingleFlagWithArgument), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(["fish", "frog", "frog"]),
                flag: flagParser,
            },
        },
        args: listWithSingleFlagWithArgument,
    });
}

export function testAllErrors() {
    const someParser = parser(
        shortFlag("a", "some help text", list([number()])),
        shortFlag("b", "B", number()),
        shortFlag("c", "C", oneOf(["ban", "can"])),
    );

    let parsed = parse(someParser, ["-a", "-b", "-c"]);

    deepStrictEqual(allErrors(parsed), [
        "Error parsing -a due to: Not enough arguments. Expected a number. at index 0",
        "Error parsing -b due to: Not enough arguments. Expected a number.",
        "Error parsing -c due to: Not enough arguments. Expected one of: ban | can.",
    ]);

    parsed = parse(someParser, ["-a", "1", "-b", "-c"]);

    deepStrictEqual(allErrors(parsed), [
        "Error parsing -b due to: Not enough arguments. Expected a number.",
        "Error parsing -c due to: Not enough arguments. Expected one of: ban | can.",
    ]);
}

export function testAllMissing() {
    const someParser = parser(
        shortFlag("a", "some help text", list([number()])),
        shortFlag("b", "B", number()),
        shortFlag("c", "C", oneOf(["ban", "can"])),
    );

    let parsed = parse(someParser, []);

    deepStrictEqual(allMissing(parsed, []), ["a", "b", "c"]);

    parsed = parse(someParser, ["-a", "1", "-c"]);

    deepStrictEqual(allMissing(parsed, []), ["b"]);

    parsed = parse(someParser, ["-a", "1"]);

    deepStrictEqual(allMissing(parsed, ["c"]), ["b"]);
}
