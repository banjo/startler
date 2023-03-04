import { CliConfig } from "../cliCreator";
import { cli } from "../misc/utils";

const install = async (cliConfig: CliConfig) => {
    const huskyAction = await cli("pnpm", ["dlx", "husky-init"], cliConfig.options);

    return !!huskyAction;
};

const uninstall = async (cliConfig: CliConfig) => {
    const removeHuskyFilesAction = await cli("rm", ["-rf", ".husky"], cliConfig.options);

    if (!removeHuskyFilesAction) {
        return false;
    }

    const latestPackageJson = cliConfig.getPackage();

    delete latestPackageJson?.scripts?.prepare;
    delete latestPackageJson?.devDependencies?.husky;

    cliConfig.setPackage(latestPackageJson);

    return true;
};

export const husky = {
    install,
    uninstall,
};
