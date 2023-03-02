import { isNil } from "@banjoanton/utils";
import { isCancel, outro, select, spinner } from "@clack/prompts";
import { writeFileSync } from "fs";
import { CliConfig } from "../cliCreator";
import { cli, exitOnFail, getNodeVersions } from "../misc/utils";

const s = spinner();

const selectNodeVersion = async (cliConfig: CliConfig) => {
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
        writeFileSync(`./${cliConfig.name}/.nvmrc`, tag);
        s.start();
        s.stop(`Updated node version to ${tag} ✅`);
    }
};

const install = async (cliConfig: CliConfig) => {
    s.start("Preparing for dependencies");

    const installDepsAction = await cli("pnpm", ["install"], cliConfig.options);

    if (!installDepsAction) {
        exitOnFail();
    }

    s.stop("Prepared for dependencies ✅");
};

const update = async (cliConfig: CliConfig) => {
    s.start("Updating to latest versions");

    const updateAction = await cli(
        "pnpm",
        ["up", "--latest"],
        cliConfig.options
    );

    if (!updateAction) {
        s.stop(`Failed to update dependencies ❌`);
        exitOnFail();
    }

    s.stop(`Updated dependencies to latest versions ✅`);
};

export const Npm = {
    selectNodeVersion,
    install,
    update,
};