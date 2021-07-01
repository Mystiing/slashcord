import { Channel, Client, Collection } from "discord.js";
import Options from "./Options";
declare class Slashcord {
    client: Client;
    commandsDir: string;
    testServers: string[];
    commands: Collection<string, any>;
    constructor(client: Client, options: Options);
    /**
     * Get commands from a guild, or globally.
     * @example
     * // Without guild ID's
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.get()
     * // With guild ID's
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.get("id")
     */
    get(guildId?: string): Promise<any>;
    /**
     * Creating a command globally, or guild only.
     * @example
     * // Without guild ID's
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.create("ping", "pong!", [])
     * // With guild ID's
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.create("ping", "pong", [], "id")
     */
    create(name: string, description: string, options?: object[], guildId?: string): Promise<any>;
    /**
     * Deleting a command globally, or guild only.
     * @example
     * // Without guild ID's
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.delete("command id")
     * // With guild ID's
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.delete("command id", "guild id")
     */
    delete(commandId: string, guildId?: string): Promise<import("node-fetch").Response>;
    APIMsg(channel: Channel, content: any): Promise<{
        files: object[] | null;
    }>;
}
export = Slashcord;
