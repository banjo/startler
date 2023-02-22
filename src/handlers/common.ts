import { replacer } from "@banjoanton/replacer";
import { isNil } from "@banjoanton/utils";
import { intro, isCancel, outro, select, spinner } from "@clack/prompts";
import { existsSync, writeFileSync } from "fs";
import { getNodeVersions, PREVIOUS_NAME, SOURCES } from "../config";
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

    const currentPath = process.cwd();
    const packageJson = await import(`${currentPath}/${name}/package.json`, {
        assert: { type: "json" },
    });

    if (!packageJson) {
        s.stop("Failed to read package.json ❌");
        exitOnFail();
    }

    s.start("Fetching node versions");

    let versions = await getNodeVersions();

    if (isNil(versions)) {
        console.log("Failed to fetch node versions");
        exitOnFail();
        return;
    }

    s.stop("Fetched node versions ✅");

    const nodeVersion = await select({
        message: "Which node version do you want to use?",
        options: versions.slice(0, 4).map((v) => ({
            value: v.latest,
            label: `${v.latest}${v.lts ? " - LTS" : ""}`,
        })),
    });

    if (isCancel(nodeVersion)) {
        outro("Cancelled ✅");
        process.exit(0);
    }

    if (nodeVersion) {
        const tag = `v${String(nodeVersion)}`;
        writeFileSync(`./${name}/.nvmrc`, tag);
        s.start();
        s.stop(`Updated node version to ${tag} ✅`);
    }

    s.start("Preparing for dependencies");

    // for husky
    const installDepsAction = await cli("pnpm", ["install"], options);

    if (!installDepsAction) {
        exitOnFail();
    }

    s.stop("Prepared for dependencies ✅");

    await handleDependencies({ command, type: "deps", packageJson, name });
    await handleDependencies({
        command,
        type: "devDeps",
        packageJson,
        name,
    });

    s.start("Updating to latest versions");

    const updateAction = await cli("pnpm", ["up", "--latest"], options);

    if (!updateAction) {
        s.stop(`Failed to update dependencies ❌`);
        exitOnFail();
    }

    s.stop(`Updated dependencies to latest versions ✅`);

    outro(`Created a new ${command} project named ${name} ✅`);
};
