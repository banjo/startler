#!/usr/bin/env node

import { cli } from "cleye";
import { version } from "../package.json";
import { createCommand } from "./utils";

console.log(); // Add a newline

cli(
    {
        name: "startler",
        version,
        commands: [
            createCommand("lib"),
            createCommand("userscript"),
            createCommand("cli"),
        ],
        help: {
            description: "Kickstart a new project easily with good defaults ✅",
        },
    },
    async (argv) => argv.showHelp()
);
