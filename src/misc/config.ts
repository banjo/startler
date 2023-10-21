import { Command, Dependencies, Dependency } from "./types";

export const PREVIOUS_NAME = "pkg-name";

export const SOURCES: Record<Command, string> = {
    lib: "git@github.com:banjo/lib-starter.git",
    userscript: "git@github.com:banjo/userscript-starter.git",
    cli: "git@github.com:banjo/cli-starter.git",
    firebase: "git@github.com:banjo/firebase-starter.git",
    monorepo: "git@github.com:banjo/monorepo-starter",
    react: "git@github.com:banjo/react-starter.git",
};

export const DEPS: Dependencies & { common: Dependency } = {
    common: {
        deps: ["ufo", "listhen"],
        devDeps: [
            "@antfu/ni",
            "@banjoanton/utils",
            "bumpp",
            "eslint",
            "tsx",
            "prettier",
            "type-fest",
            "@total-typescript/ts-reset",
        ],
    },
    userscript: {
        deps: ["@banjoanton/spa-runner", "toastler", "cash-dom"],
        devDeps: [],
    },
    cli: {
        deps: ["execa", "picocolors", "prompts", "type-flag", "consola", "pathe", "defu"],
        devDeps: [
            "@clack/prompts",
            "@types/minimist",
            "@types/prompts",
            "minimist",
            "cleye",
            "knitwork",
        ],
    },
    lib: {
        deps: ["globby", "pathe", "defu"],
        devDeps: [],
    },
    firebase: {
        deps: [],
        devDeps: [],
    },
    monorepo: {
        deps: [],
        devDeps: [],
    },
    react: {
        deps: [],
        devDeps: [],
    },
};
