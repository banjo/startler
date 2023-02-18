import { replacer } from "@banjoanton/replacer";
import { intro, outro, spinner } from "@clack/prompts";
import { existsSync } from "fs";
import { PREVIOUS_NAME, SOURCES } from "../constants";
import { Command } from "../types";
import { cli } from "../utils";

export const common = async (command: Command, name: string) => {
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
        process.exit(1);
    }

    s.stop("Fetched template from Github ✅");

    s.start("Removing .git directory");

    const removeAction = await cli("rm", ["-rf", `./${name}/.git`]);

    if (!removeAction) {
        s.stop("Failed to remove .git directory ❌");
        process.exit(1);
    }

    s.stop("Removed .git directory ✅");

    s.start("Updating names");

    const { handleFiles, commit } = await replacer([`./${name}/**/*`]);

    handleFiles(({ replaceAll }) => {
        replaceAll(PREVIOUS_NAME, name);
    });
    commit();

    s.stop("Updated names ✅");

    outro(`Created a new ${command} project named ${name} ✅`);
};
