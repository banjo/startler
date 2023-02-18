import { execa } from "execa";

export const cli = async (
    command: string,
    args: string[],
    errorHandler?: (error: Error) => void
) => {
    try {
        const { stdout, stderr } = await execa(command, args);
        return { stdout, stderr };
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
