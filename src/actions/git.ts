import { spinner } from "@clack/prompts";
import { CliConfig } from "../cliCreator";
import { SOURCES } from "../config";
import { cli, exitOnFail } from "../utils";

const s = spinner();

const init = async (config: CliConfig) => {
    s.start("Initializing git");

    const removeAction = await cli("rm", ["-rf", `.git`], config.options);

    if (!removeAction) {
        s.stop("Failed to remove .git directory ❌");
        exitOnFail();
    }

    const initAction = await cli("git", ["init"], config.options);

    if (!initAction) {
        s.stop("Failed to initialize git ❌");
        exitOnFail();
    }

    s.stop("Initialized git ✅");
};

const clone = async (config: CliConfig) => {
    s.start("Fetching template from Github");

    const source = SOURCES[config.command];
    const cloneAction = await cli("git", ["clone", source, config.name]);

    if (!cloneAction) {
        s.stop("Failed to fetch template from Github ❌");
        exitOnFail();
    }

    s.stop("Fetched template from Github ✅");
};

export const Git = {
    init,
    clone,
};
