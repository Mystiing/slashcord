import { ApplicationCommandOptionData, Client, PermissionString } from "discord.js";
declare class PrefabCommand {
    client: Client;
    name: string;
    description: string;
    category?: string;
    options?: ApplicationCommandOptionData[];
    testOnly?: boolean;
    devOnly?: boolean;
    guildOnly?: boolean;
    memberPerms?: PermissionString[];
    clientPerms?: PermissionString[];
    nsfw?: boolean;
    cooldown?: number;
    constructor(client: Client, { name, description, category, clientPerms, devOnly, cooldown, guildOnly, memberPerms, options, nsfw, testOnly, }: CommandOptions);
}
declare interface CommandOptions {
    name: string;
    description: string;
    category?: string;
    options?: ApplicationCommandOptionData[];
    testOnly?: boolean;
    devOnly?: boolean;
    guildOnly?: boolean;
    memberPerms?: PermissionString[];
    clientPerms?: PermissionString[];
    nsfw?: boolean;
    cooldown?: number;
}
export { PrefabCommand };
export type { CommandOptions };
