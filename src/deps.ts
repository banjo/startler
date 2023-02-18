import { isEqual } from "@banjoanton/utils";
import { multiselect, spinner } from "@clack/prompts";
import { Command, Dependencies, Dependency, DependencyType } from "./types";
import { cli, exitOnFail, optionsForCli } from "./utils";

const DEPS: Dependencies & { common: Dependency } = {
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
        ],
    },
    lib: {
        deps: [],
        devDeps: [],
    },
};

const getDeps = (command: Command, type: DependencyType) => {
    return [...DEPS[command][type], ...DEPS.common[type]];
};

const getPreSelectedDeps = ({
    depsFromPackage,
    command,
    type,
}: {
    depsFromPackage: string[];
    command: Command;
    type: DependencyType;
}) => {
    let deps = getDeps(command, type);
    const preSelectedDeps = depsFromPackage.filter((dep) => deps.includes(dep));
    return preSelectedDeps;
};

const getPossibleDeps = (command: Command, type: DependencyType) =>
    getDeps(command, type);

export const handleDependencies = async ({
    command,
    type,
    packageJson,
    name,
}: {
    command: Command;
    type: DependencyType;
    packageJson: any;
    name: string;
}) => {
    const options = optionsForCli(name);
    const installDepsAction = await cli("pnpm", ["install"], options);

    if (!installDepsAction) {
        exitOnFail();
    }

    const preSelectedDeps = getPreSelectedDeps({
        type,
        command,
        depsFromPackage: Object.keys(packageJson?.devDependencies),
    });

    const possibleDeps = getPossibleDeps(command, type);

    if (isEqual(possibleDeps, preSelectedDeps)) {
        return;
    }

    const depsText = type === "deps" ? "dependencies" : "devDependencies";

    const answers = (await multiselect({
        message: `Which ${depsText} do you want to install?`,
        options: possibleDeps.map((d) => ({ value: d, label: d })),
        initialValue: JSON.parse(JSON.stringify(preSelectedDeps)), // TODO: update deep clone
    })) as string[];

    if (isEqual(possibleDeps, answers)) {
        return;
    }

    // TODO: uninstall deps

    const s = spinner();
    s.start(`Installing ${depsText}`);

    const notInstalledDeps = answers.filter(
        (dep) => !preSelectedDeps.includes(dep)
    );

    if (notInstalledDeps.length === 0) {
        s.stop(`Installed ${depsText} ✅`);
        return;
    }

    const installAction = await cli(
        "pnpm",
        ["install", ...notInstalledDeps, `${type === "deps" ? "" : "-D"}`],
        options
    );

    if (!installAction) {
        s.stop(`Failed to install ${depsText} ❌`);
        exitOnFail();
    }

    s.stop(`Installed ${depsText} ✅`);
};
