import { isNil } from "@banjoanton/utils";
import { confirm, isCancel, outro, select, spinner } from "@clack/prompts";
import { writeFileSync } from "node:fs";
import { CliConfig } from "../cliCreator";
import { cli, exitOnFail, getNodeVersions } from "../misc/utils";

const s = spinner();

const selectNodeVersion = async (cliConfig: CliConfig, onlyLts = false) => {
    s.start("Fetching node versions");

    const versions = await getNodeVersions();

    if (isNil(versions)) {
        console.log("Failed to fetch node versions");
        exitOnFail();
        return;
    }

    s.stop("Fetched node versions ✅");

    const ltsVersions = versions.filter(v => v.lts);
    const selectedVersions = onlyLts ? ltsVersions : versions;
    const options = selectedVersions.slice(0, 4).map(v => ({
        value: v.latest,
        label: `${v.latest}${v.lts ? " - LTS" : ""}`,
    }));

    const nodeVersion = await select({
        message: "Which node version do you want to use?",
        options,
    });

    if (isCancel(nodeVersion)) {
        outro("Cancelled ✅");
        process.exit(0);
    }

    if (nodeVersion) {
        const tag = nodeVersion.split(".")[0];
        const tagString = `v${String(nodeVersion)}`;
        writeFileSync(`./${cliConfig.name}/.nvmrc`, tagString);

        const package_ = cliConfig.getPackage();
        if (package_?.engines?.node) {
            package_.engines.node = tag;
        }

        cliConfig.setPackage(package_);

        s.start();
        s.stop(`Updated node version to ${tagString} ✅`);
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
    const shouldUpdate = await confirm({
        message: "Do you want to update to the latest versions?",
        active: "Yes",
        inactive: "No",
        initialValue: true,
    });

    if (!shouldUpdate) {
        return;
    }

    s.start("Updating to latest versions");

    const updateAction = await cli("pnpm", ["up", "--latest", "--recursive"], cliConfig.options);

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
