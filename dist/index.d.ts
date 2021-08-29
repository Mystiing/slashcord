/// <reference types="node" />
import { ApplicationCommandOptionData, Client, Collection, CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import EventEmitter from "events";
import { SlashOptions } from "./options";
interface Slashcord {
    create(options: {
        name: string;
        description: string;
        args?: ApplicationCommandOptionData[];
        guildId?: string;
        type?: ApplicationCommandTypes;
    }): any;
    on(event: "interaction", listener: (interaction: CommandInteraction, command: any) => any): any;
}
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
    delete(options: {
        commandId: string;
        guildId?: string;
    }): Promise<import("discord.js").ApplicationCommand<{}>>;
}
export default Slashcord;
