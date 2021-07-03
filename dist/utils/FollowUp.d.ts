/// <reference types="node" />
import { Client, Guild, TextChannel } from "discord.js";
import Slashcord from "../Index";
import Interaction from "./Interaction";
declare type Options = {
    embeds?: object[];
    ephemeral?: boolean;
    flags?: boolean;
    tts?: boolean;
};
declare type EditOptions = {
    embeds?: object[];
    flags?: boolean;
    tts?: boolean;
    messageId: string;
};
interface FollowUp {
    id: string;
    token: string;
    client: Client;
    handler: Slashcord;
    channel: TextChannel | null;
    guild: Guild | null;
}
declare class FollowUp {
    constructor(interaction: Interaction, client: Client, handler: Slashcord);
    /**
     * Sending a follow up message, seems cool!
     * @example
     * <caption><b>Without ephemeral responses</b></caption>
     * const embed = new MessageEmbed()
     * .setAuthor('some author')
     *
     * interaction.reply('Some reply.')
     * interaction.followUp.send(embed)
     *
     * @example
     * <caption><b>With ephemeral responses</b></caption>
     * const embed = new MessageEmbed()
     * .setAuthor('some author')
     *
     * interaction.reply('Some reply.')
     * interaction.followUp.send(embed, { ephemeral: true })
     */
    send(content: any, options?: Options): Promise<import("discord.js").Message | undefined>;
    edit(content: any, options: EditOptions): Promise<import("discord.js").Message | undefined>;
    delete(options: {
        messageId: string;
        timeout?: number;
    }): Promise<NodeJS.Timeout | import("node-fetch").Response>;
}
export default FollowUp;
