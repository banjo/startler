import minimist from "minimist";
import { helpMessage } from "./output";
import { Command, commands } from "./types";

const isCommand = (arg: string): arg is Command => {
    return commands.includes(arg as Command);
};

export const parseCommand = (argv: minimist.ParsedArgs): Command => {
    const command = argv._[0];

    if (!command) {
        console.error("No command specified.\n");
        console.error(helpMessage);
        process.exit(1);
    }

    if (!isCommand(command)) {
        console.log(`Unknown command: ${command}\n`);
        console.error(helpMessage);
        process.exit(1);
    }

    return command;
};

export const parseName = (argv: minimist.ParsedArgs): string => {
    const name = argv._[1];

    if (!name) {
        console.error("No name specified.\n");
        console.error(helpMessage);
        process.exit(1);
    }

    return name;
};
