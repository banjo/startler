import { isEmptyArray, isEqual } from "@banjoanton/utils";
import { isCancel, multiselect, outro, spinner } from "@clack/prompts";
import { CliConfig } from "../cliCreator";
import { DEPS } from "../misc/config";
import { Command, DependencyType } from "../misc/types";
import { cli, exitOnFail } from "../misc/utils";

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
    const deps = getDeps(command, type);
    const preSelectedDeps = depsFromPackage.filter(dep => deps.includes(dep));
    return preSelectedDeps;
};

const getPossibleDeps = (command: Command, type: DependencyType) => getDeps(command, type);

export const selectDependencies = async ({
    type,
    cliConfig,
}: {
    type: DependencyType;
    cliConfig: CliConfig;
}) => {
    const isDependencies = type === "deps";
    const dependencies = cliConfig.getDependencies(type);
    const depsText = isDependencies ? "dependencies" : "devDependencies";
    const { command, options } = cliConfig;

    const preSelectedDeps = getPreSelectedDeps({
        type,
        command: command,
        depsFromPackage: Object.keys(dependencies ?? []),
    });

    const possibleDeps = getPossibleDeps(command, type);

    if (isEmptyArray(possibleDeps) && !dependencies) {
        return;
    }

    const answers = (await multiselect({
        message: `Which ${depsText} do you want to install?`,
        required: false,
        options: possibleDeps.map(d => ({ value: d, label: d })),
        initialValue: [...preSelectedDeps],
    })) as string[];

    if (isCancel(answers)) {
        outro(`Cancelled ${depsText} installation ❌`);
        process.exit(0);
    }

    if (isEqual(possibleDeps, answers)) {
        return;
    }

    const s = spinner();
    s.start(`Installing ${depsText}`);

    const notInstalledDeps = answers.filter(dep => !preSelectedDeps.includes(dep));

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

    const depsToRemove = preSelectedDeps.filter(dep => !answers.includes(dep));

    if (depsToRemove.length > 0) {
        const removeAction = await cli("pnpm", ["remove", ...depsToRemove], options);

        if (!removeAction) {
            s.stop(`Failed to remove ${depsText} ❌`);
            exitOnFail();
        }
    }

    s.stop(`Installed ${depsText} ✅`);
};
