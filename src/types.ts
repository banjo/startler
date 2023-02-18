export const commands = ["lib", "userscript"] as const;
export type Command = (typeof commands)[number];
