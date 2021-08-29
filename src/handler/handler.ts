import { Client } from "discord.js";
import { existsSync } from "fs";
import { isAbsolute, join } from "path";
import Slashcord from "..";
import SlashError from "../utils/error";
import getFiles from "../utils/getFiles";

export default class Handler {
  public client: Client;
  public handler: Slashcord;
  constructor(handler: Slashcord, rawDir: string) {
    this.client = handler.client;
    this.handler = handler;

    const dir = isAbsolute(rawDir) ? rawDir : join(require.main!.path, rawDir);
    if (!existsSync(dir)) {
      throw new SlashError(`The command directory: "${rawDir}" doesn't exist!`);
    }

    const files = getFiles(dir);
    for (const [file, fileName] of files) {
      this.register(file, fileName);
    }

    this.client.on("interactionCreate", (interaction) => {
      if (!interaction.isCommand()) return;
      if (!interaction.channel?.isText()) return;
      const cmdName = interaction.commandName.toLowerCase();
      const args = interaction.options;

      const command = this.handler.commands.get(cmdName);
      if (!command) return;
      let client = this.client;
      command.execute({ interaction, args, client });
      this.handler.emit("interaction", interaction, command);
    });
  }
  async register(file: string, fileName: string) {
    const command = (await import(file)).default;
    const { name = fileName, description, options, testOnly, extras } = command;
    if (!description) {
      throw new SlashError(
        `Please specify a description for the command: "${name}"`
      );
    }

    if (testOnly && !this.handler.testServers.length) {
      throw new SlashError(
        `The command: "${name}" has the testOnly feature, but no test servers were specified.`
      );
    }

    if (testOnly) {
      for (const server of this.handler.testServers) {
        const guild = await this.client.guilds.fetch(server);
        if (!guild) {
          throw new SlashError(`The ID: "${server}" is not a valid guild ID.`);
        }

        this.handler.commands.set(name, command);
        return await guild.commands.create({
          name,
          description,
          options,
          type: extras?.type || "CHAT_INPUT",
        });
      }
    } else {
      this.handler.commands.set(name, command);
      this.client.application?.commands.create({
        name,
        description,
        options,
        type: extras?.type || "CHAT_INPUT",
      });
    }
  }
}
