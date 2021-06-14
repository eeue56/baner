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
} from "@eeue56/baner";

const helloParser = parser([
    longFlag("name", "The name to say hi to", string()),
    longFlag("age", "The age of the person", number()),
    longFlag("pets", "Names of your pets", variableList(string())),
    bothFlag("h", "help", "This help text", empty()),
]);

function sayHi(name: string, age: number, pets: string[]): void {
    console.log(`Hi, ${name}! Congrats on being ${age} years old.`);
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
    if (program.flags.name.arguments.kind === "err") {
        console.log(program.flags.name.arguments.error);
    } else if (program.flags.age.arguments.kind === "err") {
        console.log(program.flags.age.arguments.error);
    } else if (program.flags.pets.arguments.kind === "err") {
        console.log(program.flags.pets.arguments.error);
    } else {
        sayHi(
            program.flags.name.arguments.value as string,
            program.flags.age.arguments.value as number,
            program.flags.pets.arguments.value as string[]
        );
    }
}
