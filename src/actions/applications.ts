import { confirm, isCancel, select, spinner } from "@clack/prompts";
import { husky } from "../applications/husky";
import { simpleGitHooks } from "../applications/simpleGitHooks";
import { CliConfig } from "../cliCreator";
import { exitOnFail } from "../misc/utils";

const s = spinner();

type GitHooks = "simple-git-hooks" | "husky";
const options: { value: GitHooks; label: string }[] = [
    { value: "simple-git-hooks", label: "simple-git-hooks" },
    { value: "husky", label: "husky" },
];

const gitHooks = async (cliConfig: CliConfig) => {
    const doInstall = await confirm({
        message: "Do you want to install an application for Git Hooks?",
        active: "Yes",
        inactive: "No",
        initialValue: true,
    });

    if (!doInstall) {
        await husky.uninstall(cliConfig);
        await simpleGitHooks.uninstall(cliConfig);
        return;
    }

    const gitHooksApp = await select({
        message: "Which application do you want to use?",
        options,
    });

    if (isCancel(gitHooksApp)) {
        exitOnFail();
        return;
    }

    s.start(`Installing ${gitHooksApp}`);

    switch (gitHooksApp) {
        case "simple-git-hooks": {
            await husky.uninstall(cliConfig);
            await simpleGitHooks.install(cliConfig);
            break;
        }
        case "husky": {
            await simpleGitHooks.uninstall(cliConfig);
            await husky.install(cliConfig);
            break;
        }
    }

    s.stop(`Installed ${gitHooksApp} ✅`);
};

export const Applications = {
    gitHooks,
};
