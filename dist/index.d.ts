/// <reference types="node" />
import { ApplicationCommandOptionData, Client, Collection } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import EventEmitter from "events";
import { SlashOptions } from "./options";
declare class Slashcord extends EventEmitter {
    client: Client;
    commandsDir: string;
    testServers: string[];
    commands: Collection<string, any>;
    constructor(client: Client, options: SlashOptions);
    get(options?: {
        guildId?: string;
        commandId?: string;
    }): Promise<import("discord.js").ApplicationCommand<{}> | Collection<string, import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }>> | undefined>;
    create(options: {
        name: string;
        description: string;
        args?: ApplicationCommandOptionData[];
        guildId?: string;
        type?: ApplicationCommandTypes;
    }): Promise<import("discord.js").ApplicationCommand<{}> | undefined>;
    delete(options: {
        commandId: string;
        guildId?: string;
    }): Promise<import("discord.js").ApplicationCommand<{}>>;
}
export default Slashcord;
