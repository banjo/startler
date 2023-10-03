export const commands = ["lib", "userscript", "cli", "firebase", "monorepo", "react"] as const;
export type Command = (typeof commands)[number];

export type Dependency = { deps: string[]; devDeps: string[] };
export type Dependencies = Record<Command, Dependency>;
export type DependencyType = "deps" | "devDeps";

export type Handler = (command: Command, name: string) => Promise<void>;
