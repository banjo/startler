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
            "cleye",
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
    const isDependencies = type === "deps";
    const dependencies = isDependencies
        ? packageJson.dependencies
        : packageJson.devDependencies;
    const depsText = isDependencies ? "dependencies" : "devDependencies";

    const preSelectedDeps = getPreSelectedDeps({
        type,
        command,
        depsFromPackage: Object.keys(dependencies),
    });

    const possibleDeps = getPossibleDeps(command, type);

    const answers = (await multiselect({
        message: `Which ${depsText} do you want to install?`,
        required: false,
        options: possibleDeps.map((d) => ({ value: d, label: d })),
        initialValue: JSON.parse(JSON.stringify(preSelectedDeps)), // TODO: update deep clone
    })) as string[];

    if (isEqual(possibleDeps, answers)) {
        return;
    }

    const s = spinner();
    s.start(`Installing ${depsText}`);

    const notInstalledDeps = answers.filter(
        (dep) => !preSelectedDeps.includes(dep)
    );

    if (notInstalledDeps.length > 0) {
        const installAction = await cli(
            "pnpm",
            ["install", ...notInstalledDeps, `${type === "deps" ? "" : "-D"}`],
            options
        );

        if (!installAction) {
            s.stop(`Failed to install ${depsText} ❌`);
            exitOnFail();
        }
    }

    const depsToRemove = preSelectedDeps.filter(
        (dep) => !answers.includes(dep)
    );

    if (depsToRemove.length > 0) {
        const removeAction = await cli(
            "pnpm",
            ["remove", ...depsToRemove],
            options
        );

        if (!removeAction) {
            s.stop(`Failed to remove ${depsText} ❌`);
            exitOnFail();
        }
    }

    s.stop(`Installed ${depsText} ✅`);
};
