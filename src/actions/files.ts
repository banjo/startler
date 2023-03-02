import { replacer } from "@banjoanton/replacer";
import { spinner } from "@clack/prompts";
import { CliConfig } from "../cliCreator";
import { PREVIOUS_NAME } from "../misc/config";

const s = spinner();

const replace = async (cliConfig: CliConfig) => {
    s.start("Updating names");

    const { handleFiles, commit } = await replacer([
        `./${cliConfig.name}/**/*`,
    ]);

    handleFiles(({ replaceAll }) => {
        replaceAll(PREVIOUS_NAME, cliConfig.name);
    });
    commit();

    s.stop("Updated names ✅");
};

export const Files = {
    replace,
};
