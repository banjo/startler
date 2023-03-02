export const commands = ["lib", "userscript", "cli"] as const;
export type Command = (typeof commands)[number];

export type Dependency = { deps: string[]; devDeps: string[] };
export type Dependencies = Record<Command, Dependency>;
export type DependencyType = "deps" | "devDeps";
