import { CliConfig } from "../cliCreator";
import { cli, exitOnFail } from "../misc/utils";

const install = async (cliConfig: CliConfig): Promise<boolean> => {
    const sghAction = await cli("pnpm", ["install", "simple-git-hooks", "lint-staged", "-D"], cliConfig.options);

    if (!sghAction) {
        exitOnFail();
        return false;
    }

    const pkg = cliConfig.getPackage();
    pkg["simple-git-hooks"] = {
        "pre-commit": "pnpm exec lint-staged",
    };

    pkg["ling-staged"] = {
        "*": ["prettier --write --ignore-unknown", "eslint --fix"],
    };
    cliConfig.setPackage(pkg);

    await cli("git", ["config", "core.hooksPath", ".git/hooks/"]);
    await cli("rm", ["-rf", ".git/hooks"]);
    await cli("pnpm", ["exec", "simple-git-hooks"]);

    return true;
};

const uninstall = async (cliConfig: CliConfig): Promise<boolean> => {
    const pkg = cliConfig.getPackage();
    delete pkg.devDependencies?.["simple-git-hooks"];
    delete pkg.devDependencies?.["lint-staged"];
    delete pkg?.["simple-git-hooks"];
    delete pkg?.["lint-staged"];
    cliConfig.setPackage(pkg);

    return true;
};

export const simpleGitHooks = {
    install,
    uninstall,
};
