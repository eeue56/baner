import { Ok } from "@eeue56/ts-core/build/main/lib/result";
import { Err } from "@eeue56/ts-core/build/main/lib/result";
import * as assert from "assert";
import {
    shortFlag,
    parse,
    longFlag,
    parser,
    list,
    string,
    number,
    boolean,
    bothFlag,
    empty,
    variableList,
} from "./baner";

export function testShortFlag() {
    const emptyAParser = parser([ shortFlag("a", "some help text", empty()) ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(emptyAParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "-a" ];

    assert.deepStrictEqual(parse(emptyAParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "-a" ],
    });

    const listWithMultipleFlags: string[] = [ "-a", "-b", "-c" ];

    assert.deepStrictEqual(parse(emptyAParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "-a", "-b", "-c" ],
    });

    const listWithMultiplebothFlags: string[] = [
        "--yes",
        "-c",
        "-a",
        "--no",
        "-b",
    ];

    assert.deepStrictEqual(parse(emptyAParser, listWithMultiplebothFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "--yes", "-c", "-a", "--no", "-b" ],
    });
}

export function testShortFlagWithSingleArgument() {
    const singleArgParser = parser([
        shortFlag("a", "some help text", list([ string() ])),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "-a" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "-a" ],
    });

    const listWithSingleFlagWithArgument: string[] = [ "-a", "hello" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ "hello" ]),
                },
            },
            args: [ "-a", "hello" ],
        }
    );

    const listWithMultipleFlags: string[] = [ "-a", "hello", "-b", "-c" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([ "hello" ]),
            },
        },
        args: [ "-a", "hello", "-b", "-c" ],
    });

    const listWithMultipleFlagsWithoutArgument: string[] = [ "-a", "-b", "-c" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithMultipleFlagsWithoutArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Err("Not enough arguments"),
                },
            },
            args: [ "-a", "-b", "-c" ],
        }
    );

    const listWithMultiplebothFlags: string[] = [
        "--yes",
        "-c",
        "-a",
        "hello",
        "--no",
        "-b",
    ];

    assert.deepStrictEqual(parse(singleArgParser, listWithMultiplebothFlags), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([ "hello" ]),
            },
        },
        args: [ "--yes", "-c", "-a", "hello", "--no", "-b" ],
    });
}

export function testLongFlag() {
    const emptyYesParser = parser([
        longFlag("yes", "some help text", empty()),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(emptyYesParser, emptyList), {
        flags: {
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "--yes" ];

    assert.deepStrictEqual(parse(emptyYesParser, listWithSingleFlag), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "--yes" ],
    });

    const listWithMultipleFlags: string[] = [ "--yes", "-b", "-c" ];

    assert.deepStrictEqual(parse(emptyYesParser, listWithMultipleFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "--yes", "-b", "-c" ],
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    assert.deepStrictEqual(parse(emptyYesParser, listWithMultiplebothFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "-c", "--yes", "-a", "--no", "-b" ],
    });
}

export function testLongFlagWithSingleArgument() {
    const singleArgParser = parser([
        longFlag("yes", "some help text", list([ string() ])),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "--yes" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "--yes" ],
    });

    const listWithMultipleFlags: string[] = [ "--yes", "-b", "-c" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithMultipleFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "--yes", "-b", "-c" ],
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    assert.deepStrictEqual(parse(singleArgParser, listWithMultiplebothFlags), {
        flags: {
            yes: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "-c", "--yes", "-a", "--no", "-b" ],
    });

    const listWithMultiplebothFlagsAndAnArg: string[] = [
        "-c",
        "--yes",
        "hello",
        "-a",
        "--no",
        "-b",
    ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithMultiplebothFlagsAndAnArg),
        {
            flags: {
                yes: {
                    isPresent: true,
                    arguments: Ok([ "hello" ]),
                },
            },
            args: [ "-c", "--yes", "hello", "-a", "--no", "-b" ],
        }
    );
}

export function testBothFlag() {
    const emptyYesParser = parser([
        bothFlag("y", "yes", "some help text", empty()),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(emptyYesParser, emptyList), {
        flags: {
            "y/yes": {
                isPresent: false,
                arguments: Err("Mixed flag -y/--yes not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "--yes" ];

    assert.deepStrictEqual(parse(emptyYesParser, listWithSingleFlag), {
        flags: {
            "y/yes": {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "--yes" ],
    });

    const listWithMultipleFlags: string[] = [ "--yes", "-b", "-c" ];

    assert.deepStrictEqual(parse(emptyYesParser, listWithMultipleFlags), {
        flags: {
            "y/yes": {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "--yes", "-b", "-c" ],
    });

    const listWithMultiplebothFlags: string[] = [
        "-c",
        "--yes",
        "-a",
        "--no",
        "-b",
    ];

    assert.deepStrictEqual(parse(emptyYesParser, listWithMultiplebothFlags), {
        flags: {
            "y/yes": {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "-c", "--yes", "-a", "--no", "-b" ],
    });

    const listWithMultiplebothFlagsAndShortFlag: string[] = [
        "-c",
        "-y",
        "-a",
        "--no",
        "-b",
    ];

    assert.deepStrictEqual(
        parse(emptyYesParser, listWithMultiplebothFlagsAndShortFlag),
        {
            flags: {
                "y/yes": {
                    isPresent: true,
                    arguments: Ok(null),
                },
            },
            args: listWithMultiplebothFlagsAndShortFlag,
        }
    );
}

export function testMultipleEmptyArguments() {
    const emptyAOrYesParser = parser([
        shortFlag("a", "some help text", empty()),
        longFlag("yes", "some help text", empty()),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(emptyAOrYesParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "--yes" ];

    assert.deepStrictEqual(parse(emptyAOrYesParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
            yes: {
                isPresent: true,
                arguments: Ok(null),
            },
        },
        args: [ "--yes" ],
    });

    const listWithMultipleFlags: string[] = [ "--yes", "-b", "-c" ];

    assert.deepStrictEqual(parse(emptyAOrYesParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
            yes: {
                isPresent: true,
                arguments: Ok(null),
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

    assert.deepStrictEqual(
        parse(emptyAOrYesParser, listWithMultiplebothFlags),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok(null),
                },
                yes: {
                    isPresent: true,
                    arguments: Ok(null),
                },
            },
            args: listWithMultiplebothFlags,
        }
    );

    const listWithMultiplebothFlagsInDifferentOrder: string[] = [
        "-c",
        "-a",
        "--no",
        "--yes",
        "-b",
    ];

    assert.deepStrictEqual(
        parse(emptyAOrYesParser, listWithMultiplebothFlagsInDifferentOrder),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok(null),
                },
                yes: {
                    isPresent: true,
                    arguments: Ok(null),
                },
            },
            args: listWithMultiplebothFlagsInDifferentOrder,
        }
    );
}

export function testMultipleSingleArguments() {
    const emptyAOrYesParser = parser([
        shortFlag("a", "some help text", list([ string() ])),
        longFlag("yes", "some help text", list([ string() ])),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(emptyAOrYesParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
            yes: {
                isPresent: false,
                arguments: Err("Long flag --yes not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "--yes" ];

    assert.deepStrictEqual(parse(emptyAOrYesParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
            yes: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "--yes" ],
    });

    const listWithMultipleFlags: string[] = [ "--yes", "-b", "-c" ];

    assert.deepStrictEqual(parse(emptyAOrYesParser, listWithMultipleFlags), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
            yes: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
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

    assert.deepStrictEqual(
        parse(emptyAOrYesParser, listWithMultiplebothFlags),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Err("Not enough arguments"),
                },
                yes: {
                    isPresent: true,
                    arguments: Err("Not enough arguments"),
                },
            },
            args: listWithMultiplebothFlags,
        }
    );

    const listWithMultiplebothFlagsInDifferentOrder: string[] = [
        "-c",
        "-a",
        "--no",
        "--yes",
        "-b",
    ];

    assert.deepStrictEqual(
        parse(emptyAOrYesParser, listWithMultiplebothFlagsInDifferentOrder),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Err("Not enough arguments"),
                },
                yes: {
                    isPresent: true,
                    arguments: Err("Not enough arguments"),
                },
            },
            args: listWithMultiplebothFlagsInDifferentOrder,
        }
    );
}

export function testShortFlagWithSingleNumberArgument() {
    const singleArgParser = parser([
        shortFlag("a", "some help text", list([ number() ])),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "-a" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "-a" ],
    });

    const listWithSingleFlagWithArgument: string[] = [ "-a", "hello" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Err("Not a number argument"),
                },
            },
            args: listWithSingleFlagWithArgument,
        }
    );

    const listWithSingleFlagWithNumberArgument: string[] = [ "-a", "5.5" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithNumberArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ 5.5 ]),
                },
            },
            args: listWithSingleFlagWithNumberArgument,
        }
    );

    const listWithSingleFlagWithIntArgument: string[] = [ "-a", "5" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithIntArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ 5 ]),
                },
            },
            args: listWithSingleFlagWithIntArgument,
        }
    );

    const listWithSingleFlagWithZeroArgument: string[] = [ "-a", "0" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithZeroArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ 0 ]),
                },
            },
            args: listWithSingleFlagWithZeroArgument,
        }
    );

    const listWithSingleFlagWithNegativeArgument: string[] = [ "-a", "-5.5" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithNegativeArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ -5.5 ]),
                },
            },
            args: listWithSingleFlagWithNegativeArgument,
        }
    );
}

export function testShortFlagWithSingleBooleanArgument() {
    const singleArgParser = parser([
        shortFlag("a", "some help text", list([ boolean() ])),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "-a" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "-a" ],
    });

    const listWithSingleFlagWithArgument: string[] = [ "-a", "hello" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Err("Not a boolean argument"),
                },
            },
            args: listWithSingleFlagWithArgument,
        }
    );

    const listWithSingleFlagWithTrueArgument: string[] = [ "-a", "true" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithTrueArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ true ]),
                },
            },
            args: listWithSingleFlagWithTrueArgument,
        }
    );

    const listWithSingleFlagWithFalseArgument: string[] = [ "-a", "false" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithFalseArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ false ]),
                },
            },
            args: listWithSingleFlagWithFalseArgument,
        }
    );
}

export function testShortFlagWithMultipleArguments() {
    const singleArgParser = parser([
        shortFlag("a", "some help text", list([ boolean(), string() ])),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "-a" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Err("Not enough arguments"),
            },
        },
        args: [ "-a" ],
    });

    const listWithSingleFlagWithArgument: string[] = [ "-a", "true", "hello" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ true, "hello" ]),
                },
            },
            args: listWithSingleFlagWithArgument,
        }
    );
}

export function testShortFlagWithVariableArguments() {
    const singleArgParser = parser([
        shortFlag("a", "some help text", variableList(string())),
    ]);

    const emptyList: string[] = [ ];

    assert.deepStrictEqual(parse(singleArgParser, emptyList), {
        flags: {
            a: {
                isPresent: false,
                arguments: Err("Short flag -a not found"),
            },
        },
        args: [ ],
    });

    const listWithSingleFlag: string[] = [ "-a" ];

    assert.deepStrictEqual(parse(singleArgParser, listWithSingleFlag), {
        flags: {
            a: {
                isPresent: true,
                arguments: Ok([ ]),
            },
        },
        args: [ "-a" ],
    });

    const listWithSingleFlagWithArgument: string[] = [ "-a", "true", "hello" ];

    assert.deepStrictEqual(
        parse(singleArgParser, listWithSingleFlagWithArgument),
        {
            flags: {
                a: {
                    isPresent: true,
                    arguments: Ok([ "true", "hello" ]),
                },
            },
            args: listWithSingleFlagWithArgument,
        }
    );
}
