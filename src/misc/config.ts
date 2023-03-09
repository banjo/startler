import { Command, Dependencies, Dependency } from "./types";

export const PREVIOUS_NAME = "pkg-name";

export const SOURCES: Record<Command, string> = {
    lib: "git@github.com:banjo/lib-starter.git",
    userscript: "git@github.com:banjo/userscript-starter.git",
    cli: "git@github.com:banjo/cli-starter.git",
    firebase: "git@github.com:banjo/firebase-starter.git",
};

export const DEPS: Dependencies & { common: Dependency } = {
    common: {
        deps: ["@banjoanton/replacer"],
        devDeps: [
            "@antfu/ni",
            "@banjoanton/utils",
            "case-police",
            "bumpp",
            "eslint",
            "prettier",
            "type-fest",
            "@total-typescript/ts-reset",
        ],
    },
    userscript: {
        deps: ["@banjoanton/spa-runner", "toastler"],
        devDeps: [],
    },
    cli: {
        deps: ["execa", "picocolors", "prompts", "type-flag"],
        devDeps: ["@clack/prompts", "@types/minimist", "@types/prompts", "minimist", "cleye"],
    },
    lib: {
        deps: ["globby"],
        devDeps: [],
    },
    firebase: {
        deps: ["axios"],
        devDeps: [],
    },
};
