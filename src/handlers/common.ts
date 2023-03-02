import { intro, outro, spinner } from "@clack/prompts";
import { existsSync } from "fs";
import { Applications } from "../actions/applications";
import { Files } from "../actions/files";
import { Git } from "../actions/git";
import { Npm } from "../actions/npm";
import { cliCreator } from "../cliCreator";
import { selectDependencies } from "../deps";
import { Command } from "../types";

export const common = async (command: Command, name: string) => {
    const cliConfig = cliCreator(command, name);

    intro(`Creating a new ${command} project named ${name}`);

    if (existsSync(name)) {
        outro(`Directory ${name} already exists ❌`);
        process.exit(1);
    }

    const s = spinner();
    await Git.clone(cliConfig);
    await Git.init(cliConfig);
    await Files.replace(cliConfig);
    await Npm.selectNodeVersion(cliConfig);

    // for husky
    await Npm.install(cliConfig);

    await selectDependencies({ type: "deps", cliConfig });
    await selectDependencies({
        type: "devDeps",
        cliConfig,
    });

    await Npm.update(cliConfig);
    await Applications.husky(cliConfig);

    outro(`Created a new ${command} project named ${name} ✅`);
};
