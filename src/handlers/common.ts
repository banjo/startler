import { replacer } from "@banjoanton/replacer";
import { intro, outro, spinner } from "@clack/prompts";
import { existsSync } from "fs";
import { PREVIOUS_NAME, SOURCES } from "../constants";
import { handleDependencies } from "../deps";
import { Command } from "../types";
import { cli, exitOnFail, optionsForCli } from "../utils";

export const common = async (command: Command, name: string) => {
    const options = optionsForCli(name);

    intro(`Creating a new ${command} project named ${name}`);

    if (existsSync(name)) {
        outro(`Directory ${name} already exists ❌`);
        process.exit(1);
    }

    const s = spinner();
    s.start("Fetching template from Github");

    const source = SOURCES[command];
    const cloneAction = await cli("git", ["clone", source, name]);

    if (!cloneAction) {
        s.stop("Failed to fetch template from Github ❌");
        exitOnFail();
    }

    s.stop("Fetched template from Github ✅");

    s.start("Initializing git");

    const removeAction = await cli("rm", ["-rf", `.git`], options);

    if (!removeAction) {
        s.stop("Failed to remove .git directory ❌");
        exitOnFail();
    }

    const initAction = await cli("git", ["init"], options);

    if (!initAction) {
        s.stop("Failed to initialize git ❌");
        exitOnFail();
    }

    s.stop("Initialized git ✅");

    s.start("Updating names");

    const { handleFiles, commit } = await replacer([`./${name}/**/*`]);

    handleFiles(({ replaceAll }) => {
        replaceAll(PREVIOUS_NAME, name);
    });
    commit();

    s.stop("Updated names ✅");

    const packageJson = await import(`../../${name}/package.json`);

    if (!packageJson) {
        s.stop("Failed to read package.json ❌");
        exitOnFail();
    }

    s.start("Preparing dependencies");

    // for husky
    const installDepsAction = await cli("pnpm", ["install"], options);

    if (!installDepsAction) {
        exitOnFail();
    }

    s.stop("Prepared dependencies ✅");

    await handleDependencies({ command, type: "deps", packageJson, name });
    await handleDependencies({
        command,
        type: "devDeps",
        packageJson,
        name,
    });

    outro(`Created a new ${command} project named ${name} ✅`);
};
