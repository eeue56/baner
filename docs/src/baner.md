## type StringArgument 
```javascript
export type StringArgument = {
    kind: "StringArgument";
};

```

A result from a flag: contains the flag name, if it was present in the arguments,
and whether the arguments were parsed as described.
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L12-L15)
## string
```javascript
export function string(): FlagArgument {
```

An argument parser that treats an argument as a string
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L25-L25)
## type NumberArgument 
```javascript
export type NumberArgument = {
    kind: "NumberArgument";
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L29-L32)
## number
```javascript
export function number(): FlagArgument {
```

An argument parser that treats an argument as a number
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L42-L42)
## type BooleanArgument 
```javascript
export type BooleanArgument = {
    kind: "BooleanArgument";
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L46-L49)
## boolean
```javascript
export function boolean(): FlagArgument {
```

An argument parser that treats an argument as a boolean
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L59-L59)
## type EmptyArgument 
```javascript
export type EmptyArgument = {
    kind: "EmptyArgument";
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L63-L66)
## empty
```javascript
export function empty(): FlagArgument {
```

An argument parser that always passes
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L76-L76)
## type ListArgument 
```javascript
export type ListArgument = {
    kind: "ListArgument";
    items: FlagArgument[];
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L80-L84)
## list
```javascript
export function list(flagArgumentParsers: FlagArgument[]): FlagArgument {
```

An argument parser that treats an argument as a list
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L95-L95)
## type VariableListArgument 
```javascript
export type VariableListArgument = {
    kind: "VariableListArgument";
    item: FlagArgument;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L99-L103)
## variableList
```javascript
export function variableList(flagArgumentParser: FlagArgument): FlagArgument {
```

An argument parser that treats an argument as a list
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L114-L114)
## type FlagArgument 
```javascript
export type FlagArgument =
    | StringArgument
    | NumberArgument
    | BooleanArgument
    | EmptyArgument
    | ListArgument
    | VariableListArgument;

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L120-L127)
## type Short 
```javascript
export type Short = {
    kind: "Short";
    name: string;
    help: string;
    parser: FlagArgument;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L128-L134)
## type Long 
```javascript
export type Long = {
    kind: "Long";
    name: string;
    help: string;
    parser: FlagArgument;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L144-L150)
## type Both 
```javascript
export type Both = {
    kind: "Both";
    shortName: string;
    longName: string;
    help: string;
    parser: FlagArgument;
};

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L160-L167)
## type Flag 
```javascript
export type Flag = Short | Long | Both;

```

[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L183-L184)
## shortFlag
```javascript
export function shortFlag(name: string, help: string, parser: FlagArgument) {
```

A short flag, like -y
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L188-L188)
## longFlag
```javascript
export function longFlag(name: string, help: string, parser: FlagArgument) {
```

A long flag, like --yes
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L195-L195)
## bothFlag
```javascript
export function bothFlag(
    shortName: string,
    longName: string,
    help: string,
    parser: FlagArgument
) {
```

A short or long flag, like -y or --yes
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L202-L207)
## type ProgramParser 
```javascript
export type ProgramParser = {
    flags: Flag[];
};

```

A program parser is composed of an array of flags
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L214-L217)
## parser
```javascript
export function parser(flags: Flag[]): ProgramParser {
```

A parser is composed of an array of flags
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L221-L221)
## type Program 
```javascript
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

```

A Program contains all arguments given to it, and an record of all the flags
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L230-L240)
## help
```javascript
export function help(flagParser: ProgramParser): string {
```

Creates a help text for a given program parser
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L531-L531)
## parse
```javascript
export function parse(flagParser: ProgramParser, args: string[]): Program {
```

Runs a flag parser on the args
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L558-L558)