import {
    allErrors,
    allMissing,
    allValues,
    bothFlag,
    empty,
    help,
    longFlag,
    number,
    oneOf,
    parse,
    parser,
    string,
    variableList,
} from "../../src/baner.ts";

import type { ProgramOf } from "../../src/baner.ts";

const helloParser = parser(
    longFlag("name", "The name to say hi to", string()),
    longFlag("age", "The age of the person", number()),
    longFlag("pets", "Names of your pets", variableList(string())),
    longFlag("type", "Type of owner", oneOf(["human", "alien"])),
    bothFlag("h", "help", "This help text", empty()),
);

function sayHi(
    name: string,
    age: number,
    pets: string[],
    type: "human" | "alien",
): void {
    console.log(`Hi, ${name}! Congrats on being ${age} years old.`);
    if (type === "alien") console.log("Welcome to earth!");

    if (pets.length > 0) {
        console.log(
            `Wow, you had ${pets.length} pets. I bet ${pets.join(
                ", ",
            )} were good pets to have`,
        );
    }
}

function showHelp(program: ProgramOf<typeof helloParser>): void {
    console.log("Provide a name via --name and age via --age");
    console.log(help(helloParser));
    console.log("Supported flags:", program.flags);
}

const program = parse(helloParser, process.argv);

if (program.flags["help"].isPresent) {
    showHelp(program);
} else {
    const errors = allErrors(program);
    const missing = allMissing(program, ["help"]);
    const values = allValues(program);

    if (errors.length > 0) {
        console.log("Errors:");
        console.log(errors.join("\n"));
    } else if (missing.length > 0) {
        console.log("Missing flags:");
        console.log(missing.join("\n"));
    } else {
        sayHi(values.name!, values.age!, values.pets!, values.type!);
    }
}
