import { Command, Dependencies, Dependency } from "./types";

export const PREVIOUS_NAME = "pkg-name";

export const SOURCES: Record<Command, string> = {
    lib: "git@github.com:banjo/lib-starter.git",
    userscript: "git@github.com:banjo/userscript-starter.git",
    cli: "",
};

export const DEPS: Dependencies & { common: Dependency } = {
    common: {
        deps: [],
        devDeps: [
            "@antfu/ni",
            "@banjoanton/replacer",
            "@banjoanton/utils",
            "bumpp",
            "eslint",
            "pnpm",
            "prettier",
            "type-fest",
        ],
    },
    userscript: {
        deps: ["@banjoanton/spa-runner", "toastler"],
        devDeps: [],
    },
    cli: {
        deps: [],
        devDeps: [
            "@clack/prompts",
            "@types/minimist",
            "@types/prompts",
            "execa",
            "minimist",
            "picocolors",
            "prompts",
            "cleye",
        ],
    },
    lib: {
        deps: [],
        devDeps: [],
    },
};
