import { intro, outro } from "@clack/prompts";
import { existsSync } from "fs";
import { Applications } from "../actions/applications";
import { Files } from "../actions/files";
import { Git } from "../actions/git";
import { Npm } from "../actions/npm";
import { cliCreator } from "../cliCreator";
import { Command, Handler } from "../misc/types";
import { selectDependencies } from "../services/deps";

export const common: Handler = async (command: Command, name: string) => {
    const cliConfig = cliCreator(command, name);

    intro(`Creating a new ${command} project named ${name}`);

    if (existsSync(name)) {
        outro(`Directory ${name} already exists ❌`);
        process.exit(1);
    }

    await Git.clone(cliConfig);
    await Git.init(cliConfig);
    await Files.replace(cliConfig);
    await Npm.selectNodeVersion(cliConfig);

    await selectDependencies({ type: "deps", cliConfig });
    await selectDependencies({
        type: "devDeps",
        cliConfig,
    });

    await Npm.update(cliConfig);
    await Applications.gitHooks(cliConfig);

    outro(`Created a new ${command} project named ${name} ✅`);
};
