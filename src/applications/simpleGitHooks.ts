import { CliConfig } from "../cliCreator";
import { cli, exitOnFail } from "../misc/utils";

const install = async (cliConfig: CliConfig): Promise<boolean> => {
    const sghAction = await cli(
        "pnpm",
        ["install", "simple-git-hooks", "lint-staged", "-D"],
        cliConfig.options
    );

    if (!sghAction) {
        exitOnFail();
        return false;
    }

    const package_ = cliConfig.getPackage();
    package_["simple-git-hooks"] = {
        "pre-commit": "pnpm exec lint-staged",
    };

    package_["ling-staged"] = {
        "*": ["prettier --write --ignore-unknown", "eslint --fix"],
    };
    cliConfig.setPackage(package_);

    await cli("git", ["config", "core.hooksPath", ".git/hooks/"]);
    await cli("rm", ["-rf", ".git/hooks"]);
    await cli("pnpm", ["exec", "simple-git-hooks"]);

    return true;
};

const uninstall = (cliConfig: CliConfig): boolean => {
    const package_ = cliConfig.getPackage();
    delete package_.devDependencies?.["simple-git-hooks"];
    delete package_.devDependencies?.["lint-staged"];
    delete package_?.["simple-git-hooks"];
    delete package_?.["lint-staged"];
    cliConfig.setPackage(package_);

    return true;
};

export const simpleGitHooks = {
    install,
    uninstall,
};
