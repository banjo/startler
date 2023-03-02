import { select, spinner } from "@clack/prompts";
import { husky as huskyApp } from "../applications/husky";
import { CliConfig } from "../cliCreator";
import { exitOnFail } from "../utils";

const s = spinner();

const husky = async (cliConfig: CliConfig) => {
    const useHusky = await select({
        message: "Do you want to use husky?",
        options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
        ],
    });

    s.start("Updating husky");

    if (useHusky) {
        const huskyAction = await huskyApp.install(cliConfig);

        if (!huskyAction) {
            s.stop(`Failed to add husky ❌`);
            exitOnFail();
        }
    } else {
        const removeHuskyAction = await huskyApp.uninstall(cliConfig);

        if (!removeHuskyAction) {
            s.stop(`Failed to remove husky ❌`);
            exitOnFail();
        }
    }

    s.stop(`Updated husky ✅`);
};

export const Applications = {
    husky,
};
