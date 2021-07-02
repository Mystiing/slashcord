import { Client, Guild, GuildMember, TextChannel } from "discord.js";
import Slashcord from "../Index";
import FollowUp from "./FollowUp";
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
    channel: TextChannel | undefined;
    id: string;
    guildID: string;
    data: DataOptions[];
    channelID: string;
    applicationID: string;
    handler: Slashcord;
    _followUp: FollowUp;
}
declare class Interaction {
    constructor(interaction: any, client: Client, handler: Slashcord);
    /**
     * Replying to an interaction sent by the user.
     * @example
     * <caption><b>Without ephemeral responses.</b></caption>
     * const embed = new MessageEmbed();
     * .setAuthor("some author")
     * interaction.reply(embed)
     * @example
     * <caption><b>With ephemeral responses.</b></caption>
     * const embed = new MessageEmbed();
     * .setAuthor("some author")
     * interaction.reply(embed, { ephemeral: true })
     *
     */
    reply(content: any, options?: Options): Promise<import("node-fetch").Response>;
    /**
     * Editing our initial interaction response.
     * @example
     * <caption><b>With embeds</b></caption>
     * interaction.reply("hey!")
     *
     * const embed = new MessageEmbed();
     * .setTitle("some title.")
     * await interaction.edit("", { embeds: [embed] })
     *
     * @example
     * <caption></b>Without embeds</b></caption>
     * interaction.reply("hey!")
     * await interaction.edit("you sure?")
     */
    edit(content: any, options?: Options): Promise<import("node-fetch").Response>;
    /**
     * Deleting our initial interaction response.
     * @example
     * <caption><b>With options</b></caption>
     * interaction.reply("hey!")
     * // Timeout must be in milliseconds.
     * await interaction.delete({ timeout: 1000 })
     * @example
     * <caption><b>Without options</b></caption>
     * interaction.reply("hey!")
     * interaction.delete()
     */
    delete(options?: {
        timeout: number;
    }): Promise<void>;
    /**
     * We are think about what we need to say.
     * NOTE: We need to edit the response!
     * @example
     * interaction.thinking()
     * await interaction.edit("I was thinking.")
     */
    thinking(): Promise<void>;
    fetchReply(): Promise<import("discord.js").Message>;
    get followUp(): FollowUp;
}
export default Interaction;
