#!/usr/bin/env node

import minimist from "minimist";
import { lib } from "./handlers/lib";
import { helpMessage } from "./output";
import { parseCommand, parseName } from "./parseArgs";

const argv = minimist(process.argv.slice(2));
const showHelp = argv._.some((arg) => ["-h", "--help"].includes(arg));

console.log(); // Add a newline

if (showHelp) {
    console.log(helpMessage);
    process.exit(0);
}

const command = parseCommand(argv);
const name = parseName(argv);

async function main() {
    switch (command) {
        case "lib":
            lib(name);
            break;
        case "userscript":
            console.log(`Creating a new userscript project named ${name}`);
            break;

        default:
            console.error(`Unknown command: ${command}`);
            process.exit(1);
    }
}

main().catch(console.error);
