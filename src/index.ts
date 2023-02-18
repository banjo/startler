#!/usr/bin/env node

import minimist from "minimist";
import { HELP_MESSAGE } from "./constants";
import { common } from "./handlers/common";
import { parseCommand, parseName } from "./parseArgs";

const argv = minimist(process.argv.slice(2));
const showHelp = argv.h || argv.help || !argv._.length;

console.log(); // Add a newline

if (showHelp) {
    console.log(HELP_MESSAGE);
    process.exit(0);
}

const command = parseCommand(argv);
const name = parseName(argv);

async function main() {
    switch (command) {
        case "lib":
            common(command, name);
            break;
        case "userscript":
            // TODO: rename to pkg-name in project
            common(command, name);
            break;
        default:
            console.error(`Unknown command: ${command}`);
            process.exit(1);
    }
}

main().catch(console.error);
