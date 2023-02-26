import fs from "fs";
import { PackageJson } from "type-fest";
import { Command, DependencyType } from "./types";
import { optionsForCli } from "./utils";

export const cliCreator = (command: Command, name: string) => {
    const options = optionsForCli(name);

    const getPackage = (): PackageJson => {
        const pkgString = fs.readFileSync(`./${name}/package.json`, "utf-8");
        const pkg: PackageJson = JSON.parse(pkgString);
        return pkg;
    };

    const setPackage = (pkg: PackageJson) => {
        fs.writeFileSync(
            `./${name}/package.json`,
            JSON.stringify(pkg, null, 4)
        );
    };

    const getDependencies = (type: DependencyType) => {
        const pkg = getPackage();
        let dependencies =
            type === "deps" ? pkg.dependencies : pkg.devDependencies;

        if (!dependencies) {
            dependencies = {};
        }

        return dependencies;
    };

    const setDependencies = (
        type: DependencyType,
        deps: Partial<Record<string, string>>
    ) => {
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
    };
};

export type CliConfig = ReturnType<typeof cliCreator>;
