## parser

```javascript
export function parser<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(...flags: flags): ProgramParser<flags> {
```

A parser is composed of an array of flags
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L24-L26)

## help

```javascript
export function help<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(flagParser: ProgramParser<flags>): string {
```

Creates a help text for a given program parser
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L396-L398)

## allErrors

```javascript
export function allErrors<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(program: Program<flags>): string[] {
```

Reports all errors in a program, ignoring missing flags.
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L435-L437)

## allMissing

```javascript
export function allMissing<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(program: Program<flags>, ignore: string[]): string[] {
```

Reports missing flags, ignoring the ones you don't care about.
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L460-L462)

## allValues

```javascript
export function allValues<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(program: Program<flags>): ProgramValues<flags> {
```

Gets the Ok values out of the program as the raw type (i.e a `string` from `string()`)
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L476-L478)

## parse

```javascript
export function parse<
    const flags extends readonly Flag<FlagArgument<KnownTypes>, string>[],
>(flagParser: ProgramParser<flags>, args: string[]): Program<flags> {
```

Runs a flag parser on the args
[View source](https://github.com/eeue56/baner/blob/main/src/baner.ts#L497-L499)
