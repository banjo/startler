import { Command } from "./types";

export const PREVIOUS_NAME = "pkg-name";

export const SOURCES: Record<Command, string> = {
    lib: "git@github.com:banjo/lib-starter.git",
    userscript: "git@github.com:banjo/userscript-starter.git",
    cli: "",
};
