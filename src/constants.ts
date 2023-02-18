import { Command } from "./types";

export const HELP_MESSAGE = `Usage: clistart [options]

clistart lib <name> - Create a new library project
clistart userscript <name> - Create a new userscript project

Options:
-h, --help      Show this help message

`;

export const PREVIOUS_NAME = "pkg-name";

export const SOURCES: Record<Command, string> = {
    lib: "git@github.com:banjo/lib-starter.git",
    userscript: "git@github.com:banjo/userscript-starter.git",
    cli: "",
};
