import {
    empty,
    longFlag,
    bothFlag,
    number,
    parse,
    parser,
    string,
    help,
    variableList,
    oneOf,
    allErrors,
    allMissing,
} from "@eeue56/baner";
import { Ok } from "@eeue56/ts-core/build/main/lib/result";

const helloParser = parser([
    longFlag("name", "The name to say hi to", string()),
    longFlag("age", "The age of the person", number()),
    longFlag("pets", "Names of your pets", variableList(string())),
    longFlag("type", "Type of owner", oneOf([ "human", "alien" ])),
    bothFlag("h", "help", "This help text", empty()),
]);

function sayHi(
    name: string,
    age: number,
    pets: string[],
    type: "human" | "alien"
): void {
    console.log(`Hi, ${name}! Congrats on being ${age} years old.`);
    if (type === "alien") console.log("Welcome to earth!");

    if (pets.length > 0) {
        console.log(
            `Wow, you had ${pets.length} pets. I bet ${pets.join(
                ", "
            )} were good pets to have`
        );
    }
}

function showHelp(): void {
    console.log("Provide a name via --name and age via --age");
    console.log(help(helloParser));
}

const program = parse(helloParser, process.argv);

if (program.flags["h/help"].isPresent) {
    showHelp();
} else {
    const errors = allErrors(program);
    const missing = allMissing(program, [ "h/help" ]);

    if (errors.length > 0) {
        console.log("Errors:");
        console.log(errors.join("\n"));
    } else if (missing.length > 0) {
        console.log("Missing flags:");
        console.log(missing.join("\n"));
    } else {
        sayHi(
            (program.flags.name.arguments as Ok<string>).value,
            (program.flags.age.arguments as Ok<number>).value as number,
            (program.flags.pets.arguments as Ok<string[]>).value as string[],
            (program.flags.type.arguments as Ok<string>).value as
                | "human"
                | "alien"
        );
    }
}
