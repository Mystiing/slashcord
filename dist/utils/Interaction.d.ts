import { Channel, Client, Guild, GuildMember, TextChannel } from "discord.js";
import Slashcord from "../Index";
declare type Options = {
    embeds?: object[];
    type?: number;
    ephemeral?: boolean;
    flags?: boolean;
    tts?: boolean;
};
declare type DataOptions = {
    name: string;
    id: string;
    /** Idk the type. */
    options: any;
};
interface Interaction {
    client: Client;
    version: number;
    type: number;
    token: string;
    member: GuildMember | null;
    guild: Guild | null;
    channel: TextChannel | Channel | undefined;
    id: string;
    guildID: string;
    data: DataOptions[];
    channelID: string;
    applicationID: string;
    handler: Slashcord;
}
declare class Interaction {
    constructor(interaction: any, client: Client, handler: Slashcord);
    /**
     * Replying to an interaction sent by the user.
     * @example
     * interaction.reply("Hey!")
     */
    reply(content: string, options?: Options): Promise<import("node-fetch").Response>;
}
export default Interaction;
