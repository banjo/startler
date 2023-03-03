import { intro, outro } from "@clack/prompts";
import { existsSync } from "fs";
import { Files } from "../actions/files";
import { Firebase } from "../actions/firebase";
import { Npm } from "../actions/npm";
import { cliCreator } from "../cliCreator";
import { Command, Handler } from "../misc/types";
import { selectDependencies } from "../services/deps";

export const firebase: Handler = async (command: Command, name: string) => {
    const cliConfig = cliCreator(command, name);

    if (existsSync(name)) {
        outro(`Directory ${name} already exists ❌`);
        process.exit(1);
    }

    intro(`Creating a new ${command} project named ${name}`);

    if (!(await Firebase.isCliInstalled())) {
        await Firebase.installCli();
    }

    await Firebase.init(cliConfig);

    await Files.replace(cliConfig);
    await Npm.selectNodeVersion(cliConfig, true);

    await selectDependencies({ type: "deps", cliConfig });
    await selectDependencies({
        type: "devDeps",
        cliConfig,
    });

    await Npm.install(cliConfig);
    await Npm.update(cliConfig);

    outro(`Created a new ${command} project named ${name} ✅`);
};
