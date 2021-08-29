import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  Client,
  Collection,
  CommandInteraction,
} from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import EventEmitter from "events";
import Handler from "./handler/handler";
import { SlashOptions } from "./options";
import SlashError from "./utils/error";

class Slashcord extends EventEmitter {
  public client: Client;

  public commandsDir: string = "./commands";
  public testServers: string[] = [];

  public commands: Collection<string, any> = new Collection();
  constructor(client: Client, options: SlashOptions) {
    super();
    if (!client) {
      throw new SlashError(
        "You must provide a valid client in the first parameter."
      );
    }

    this.client = client;
    this.commandsDir = options.commandsDir || "./commands";

    if (options.testServers) {
      if (typeof options.testServers === "string") {
        options.testServers = [options.testServers];
      }
      this.testServers = options.testServers;
    }

    new Handler(this, this.commandsDir);
  }
  async get(options?: { guildId?: string; commandId?: string }) {
    if (!options) {
      const commands = await this.client.application?.commands.fetch();
      return commands;
    }

    if (options.guildId) {
      const guild = await this.client.guilds.fetch(options.guildId);
      if (!guild) {
        throw new SlashError("The guild ID provided was not a valid guild!");
      }
      const commands = await guild.commands.fetch();
      return commands;
    }

    if (options.commandId) {
      const command = await this.client.application?.commands.fetch(
        options.commandId
      );
      if (!command) {
        throw new SlashError(
          "The command ID provided was not a valid command!"
        );
      }
      return command;
    }

    if (options.guildId && options.commandId) {
      const guild = await this.client.guilds.fetch(options.guildId);
      if (!guild) {
        throw new SlashError("The guild ID provided was not a valid guild!");
      }

      const command = await guild.commands.fetch(options.commandId);
      if (!command) {
        throw new SlashError(
          "The command ID provided was not a valid command!"
        );
      }
      return command;
    }
  }
  async create(options: {
    name: string;
    description: string;
    args?: ApplicationCommandOptionData[];
    guildId?: string;
    type?: ApplicationCommandTypes;
  }) {
    const {
      name,
      description,
      args = [],
      guildId = "",
      type = "CHAT_INPUT",
    } = options;

    if (guildId) {
      const guild = await this.client.guilds.fetch(guildId);
      if (!guild) {
        throw new SlashError("The guild ID provided was not a valid guild!");
      }

      const command = await guild.commands.create({
        name,
        description,
        options: args,
        type,
      });
      return command;
    }

    return await this.client.application?.commands.create({
      name,
      description,
      options: args,
      type,
    });
  }
  async delete(options: { commandId: string; guildId?: string }) {
    if (options.guildId) {
      const guild = await this.client.guilds.fetch(options.guildId);
      if (!guild) {
        throw new SlashError("The guild ID provided was not a valid guild!");
      }

      const command = await guild.commands.fetch(options.commandId);
      if (!command) {
        throw new SlashError(
          "The command ID provided was not a valid command!"
        );
      }

      return await command.delete();
    }
    const command = await this.client.application?.commands.fetch(
      options.commandId
    );
    if (!command) {
      throw new SlashError("The command ID provided was not a valid command!");
    }
    return await command.delete();
  }
}

export default Slashcord;
module.exports = Slashcord;
