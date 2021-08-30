import { Channel, Client, Collection } from "discord.js";
import Options from "./Options";
import Interaction from "./utils/Interaction";
import Command from "./utils/other/Command";
declare class Slashcord {
    client: Client;
    commandsDir: string;
    testServers: string[];
    commands: Collection<string, Command>;
    permissionError: string;
    constructor(client: Client, options: Options);
    /**
     * Get commands from a guild, or globally.
     * @example
     * <caption>Without guild ID's</caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.get()
     * @example
     * <caption>With guild ID's</caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.get("id")
     */
    get(guildId?: string): Promise<any>;
    /**
     * Creating a command globally, or guild only.
     * @example
     * <caption> Without guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.create("ping", "pong!", [])
     * @example
     * <caption> With guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.create("ping", "pong", [], "id")
     */
    create(name: string, description: string, options?: object[], guildId?: string | string[]): Promise<any>;
    /**
     * Deleting a command globally, or guild only.
     * @example
     * <caption> Without guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.delete("command id")
     * @example
     * <caption> With guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.delete("command id", "guild id")
     */
    delete(commandId: string, guildId?: string): Promise<import("node-fetch").Response>;
    APIMsg(channel: Channel, content: any): Promise<{
        files: object[] | null;
    }>;
}
export default Slashcord;
export { Command, Interaction };
