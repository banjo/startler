import { outro } from "@clack/prompts";
import allNodeVersions from "all-node-versions";
import { command as cliCommand, type Command as CommandType } from "cleye";
import { execa, Options } from "execa";
import { common } from "../handlers/common";
import { Command } from "./types";

export const cli = async (
    command: string,
    args: string[],
    options?: Options,
    errorHandler?: (error: Error) => void
) => {
    try {
        const {
            stdout,
            stderr,
            command: stdin,
        } = await execa(command, args, options);
        return { stdout, stderr, stdin };
    } catch (error) {
        let e: Error;
        if (typeof error === "string") {
            e = new Error(error);
        } else if (error instanceof Error) {
            e = error;
        } else {
            e = new Error("Unknown error");
        }

        if (errorHandler) {
            errorHandler(e);
        } else {
            console.error(error);
        }

        return null;
    }
};

export const createCommand = (command: Command): CommandType => {
    const name = "<name>";

    return cliCommand(
        {
            name: command,
            parameters: [name],
            help: {
                description: `Create a new ${command} project`,
                usage: `${command} ${name}`,
            },
        },
        async (argv) => await common(command, argv._.name)
    );
};

export const optionsForCli = (name: string) => ({
    cwd: `./${name}`,
});

export const exitOnFail = (error?: string) => {
    if (error) {
        outro(error);
        process.exit(1);
    } else {
        outro("Failed to create project 😢");
        process.exit(1);
    }
};

export const getNodeVersions = async () => {
    const { majors } = await allNodeVersions();
    if (!majors) return null;

    return majors;
};
