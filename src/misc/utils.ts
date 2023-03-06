import { outro } from "@clack/prompts";
import allNodeVersions from "all-node-versions";
import { command as cliCommand, type Command as CommandType } from "cleye";
import { execa, Options } from "execa";
import { common } from "../handlers/common";
import { Runtime } from "./runtime";
import { Command, Handler } from "./types";

export const cli = async (
    command: string,
    arguments_: string[],
    options?: Options & { logError?: boolean }
) => {
    try {
        const { stdout, stderr, command: stdin } = await execa(command, arguments_, options);
        return { stdout, stderr, stdin };
    } catch (error_) {
        let error: Error;

        if (typeof error_ === "string") {
            error = new Error(error_);
        } else if (error_ instanceof Error) {
            error = error_;
        } else {
            error = new Error("Unknown error");
        }

        if (options?.logError || Runtime.isDebugging()) {
            console.error(error);
        }

        return null;
    }
};

export const createCommand = (command: Command, handler?: Handler): CommandType => {
    const name = "<name>";

    return cliCommand(
        {
            name: command,
            parameters: [name],
            help: {
                description: `Create a new ${command} project`,
                usage: `${command} ${name}`,
            },
            flags: {
                debug: {
                    type: Boolean,
                    description: "Show debug information",
                },
            },
        },
        async argv => {
            if (argv.flags.debug) {
                Runtime.setDebug(true);
            }

            if (handler) {
                await handler(command, argv._.name);
            } else {
                await common(command, argv._.name);
            }
        }
    );
};

export const optionsForCli = (name: string, command?: Command) => {
    const cwd = command === "firebase" ? `./${name}/functions` : `./${name}`;

    return {
        cwd,
    };
};

export const exitOnFail = (error?: string) => {
    if (error) {
        if (Runtime.isDebugging()) {
            console.log("Program exited with error:");
            console.error(error);
        }
        outro(error);
        process.exit(1);
    } else {
        outro("Failed to create project 😢");
        process.exit(1);
    }
};

export const getNodeVersions = async () => {
    const { majors } = await allNodeVersions();
    if (!majors) {
        return null;
    }

    return majors;
};
