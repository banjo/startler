import fs from "fs";
import { PackageJson } from "type-fest";
import { Command, DependencyType } from "./misc/types";
import { optionsForCli } from "./misc/utils";

export const cliCreator = (command: Command, name: string) => {
    const options = optionsForCli(name, command);
    const packageDirectory = options.cwd;

    const getPackage = (): PackageJson => {
        const pkgString = fs.readFileSync(`${packageDirectory}/package.json`, "utf-8");
        const pkg: PackageJson = JSON.parse(pkgString);
        return pkg;
    };

    const setPackage = (pkg: PackageJson) => {
        fs.writeFileSync(`${packageDirectory}/package.json`, JSON.stringify(pkg, null, 4));
    };

    const getDependencies = (type: DependencyType) => {
        const pkg = getPackage();
        let dependencies = type === "deps" ? pkg.dependencies : pkg.devDependencies;

        if (!dependencies) {
            dependencies = {};
        }

        return dependencies;
    };

    const setDependencies = (type: DependencyType, deps: Partial<Record<string, string>>) => {
        const pkg = getPackage();
        if (type === "deps") {
            pkg.dependencies = deps;
        } else {
            pkg.devDependencies = deps;
        }

        setPackage(pkg);
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
