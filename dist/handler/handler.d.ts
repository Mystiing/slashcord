import { Client } from "discord.js";
import Slashcord from "..";
export default class Handler {
    client: Client;
    handler: Slashcord;
    constructor(handler: Slashcord, rawDir: string);
    register(file: string, fileName: string): Promise<import("discord.js").ApplicationCommand<{}> | undefined>;
}
