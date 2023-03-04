import fs from "node:fs";
import { PackageJson } from "type-fest";
import { Command, DependencyType } from "./misc/types";
import { optionsForCli } from "./misc/utils";

export const cliCreator = (command: Command, name: string) => {
    const options = optionsForCli(name, command);
    const packageDirectory = options.cwd;

    const getPackage = (): PackageJson => {
        const packageString = fs.readFileSync(`${packageDirectory}/package.json`, "utf8");
        const package_: PackageJson = JSON.parse(packageString);
        return package_;
    };

    const setPackage = (package_: PackageJson) => {
        fs.writeFileSync(`${packageDirectory}/package.json`, JSON.stringify(package_, null, 4));
    };

    const getDependencies = (type: DependencyType) => {
        const package_ = getPackage();
        let dependencies = type === "deps" ? package_.dependencies : package_.devDependencies;

        if (!dependencies) {
            dependencies = {};
        }

        return dependencies;
    };

    const setDependencies = (type: DependencyType, deps: Partial<Record<string, string>>) => {
        const package_ = getPackage();
        if (type === "deps") {
            package_.dependencies = deps;
        } else {
            package_.devDependencies = deps;
        }

        setPackage(package_);
    };

    return {
        getPackage,
        setPackage,
        getDependencies,
        setDependencies,
        options,
        command,
        name,
        packageDirectory,
    };
};

export type CliConfig = ReturnType<typeof cliCreator>;
