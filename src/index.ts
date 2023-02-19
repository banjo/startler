#!/usr/bin/env node

import { cli, command as cliCommand } from "cleye";
import { version } from "../package.json";
import { common } from "./handlers/common";

console.log(); // Add a newline

const name = "<name>";

const lib = cliCommand(
    {
        name: "lib",
        parameters: [name],
        help: {
            description: "Create a new library project",
            usage: "lib <name>",
        },
    },
    async (argv) => await common("lib", argv._.name)
);

const userscript = cliCommand(
    {
        name: "userscript",
        parameters: [name],
        help: {
            description: "Create a new userscript project",
            usage: "userscript <name>",
        },
    },
    async (argv) => await common("userscript", argv._.name)
);

cli(
    {
        name: "startler",
        version,
        commands: [lib, userscript],
        help: {
            description: "Kickstart a new project easily with good defaults ✅",
        },
    },
    async (argv) => argv.showHelp()
);
