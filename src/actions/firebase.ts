import { confirm, isCancel, outro, spinner } from "@clack/prompts";
import { existsSync, mkdirSync, rmSync } from "fs";
import { CliConfig } from "../cliCreator";
import { cli, exitOnFail } from "../misc/utils";
import { Git } from "./git";

const s = spinner();

const isCliInstalled = async () => {
    const action = await cli("firebase", ["--version"], { logError: false });

    if (action === null || action.stdout === "") {
        return false;
    }

    return true;
};

const installCli = async () => {
    const install = await confirm({
        message: "Firebase CLI is not installed. Do you want to install it globally?",
    });

    if (isCancel(install)) {
        outro("Cancelled ✅");
        process.exit(0);
    }

    if (!install) {
        exitOnFail();
        return false;
    }

    s.start("Installing Firebase CLI");

    const action = await cli("npm", ["install", "-g", "firebase-tools"]);

    if (!action) {
        exitOnFail();
        return false;
    }

    s.stop("Installed Firebase CLI ✅");

    return true;
};

const init = async (cliConfig: CliConfig) => {
    const tempName = cliConfig.name + "-temp";

    if (existsSync(tempName)) {
        rmSync(tempName, { recursive: true });
    }

    mkdirSync(tempName);

    await cli("firebase", ["init", "functions"], {
        cwd: tempName,
        stdio: "inherit",
    });

    await Git.clone(cliConfig);
    await Git.init(cliConfig);

    s.start("Preparing Firebase");

    const moveAction = await cli("mv", [`${tempName}/.firebaserc`, `${tempName}/firebase.json`, cliConfig.name]);

    if (!moveAction) {
        exitOnFail();
        return false;
    }

    rmSync(tempName, { recursive: true });

    s.stop("Prepared Firebase ✅");

    return true;
};

export const Firebase = {
    isCliInstalled,
    installCli,
    init,
};
