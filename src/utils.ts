import { outro } from "@clack/prompts";
import { execa, Options } from "execa";

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
