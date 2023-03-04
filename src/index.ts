#!/usr/bin/env node

import { cli } from "cleye";
import { version } from "../package.json";
import { firebase } from "./handlers/firebase";
import { createCommand } from "./misc/utils";

console.log(); // Add a newline

cli(
    {
        name: "startler",
        version,
        commands: [
            createCommand("lib"),
            createCommand("userscript"),
            createCommand("cli"),
            createCommand("firebase", firebase),
        ],
        help: {
            description: "Kickstart a new project easily with good defaults ✅",
        },
    },
    async (argv) => argv.showHelp()
);
