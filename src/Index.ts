import { APIMessage, Channel, Client, Collection } from "discord.js";
import EventEmitter from "events";
import { Handler } from "./handlers/Handler";
import Options from "./Options";

import fetch from "node-fetch";
import Interaction from "./utils/Interaction";
import Command from "./utils/other/Command";
import AppCommand from "./utils/AppCommand";

class Slashcord {
  public client: Client;

  public commandsDir: string = "./commands";
  public testServers: string[] = [];

  public commands: Collection<string, Command> = new Collection();

  public permissionError: string =
    "You don't have the {PERMISSION} permission to use that.";

  constructor(client: Client, options: Options) {
    /** If no client was provided, we warn them. */
    if (!client) {
      throw new Error("Please provide a valid Discord.JS client.");
    }

    this.client = client;
    this.commandsDir = options?.commandsDir ?? "./commands";
    this.permissionError =
      options?.customSettings?.permissionError ??
      "You don't have the {PERMISSION} permission to use that.";

    if (options.testServers!) {
      if (typeof options.testServers === "string") {
        options.testServers = [options.testServers];
      }

      this.testServers = options.testServers!;
    }

    new Handler(this, this.commandsDir);
  }
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
  async get(guildId?: string) {
    const appId = this.client.user?.id;

    let url = `https://discord.com/api/v9/applications/${appId}`;

    if (guildId) {
      url += `/guilds/${guildId}`;
    }
    url += "/commands";

    const res = await (
      await fetch(url, {
        headers: {
          Authorization: `Bot ${this.client.token}`,
          "Content-Type": "application/json",
        },
      })
    ).json();
    // let cmd;
    // res.forEach((command: any) => {
    //   cmd = new AppCommand(command);
    //   return cmd;
    // });
    return res;
  }

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
  async create(
    name: string,
    description: string,
    options: object[] = [],
    guildId?: string | string[]
  ) {
    const appId = this.client.user?.id;

    let url = `https://discord.com/api/v9/applications/${appId}`;
    if (guildId) {
      url += `/guilds/${guildId}`;
    }
    url += `/commands`;

    let data = {
      name,
      description,
      options,
    };

    return await (
      await fetch(url, {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          Authorization: `Bot ${this.client.token}`,
          "Content-Type": "application/json",
        },
      })
    ).json();
  }
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
  async delete(commandId: string, guildId?: string) {
    const appId = this.client.user?.id;
    let url = `https://discord.com/api/v9/applications/${appId}`;

    if (guildId) {
      url += `/guilds/${guildId}`;
    }
    url = `/commands/${commandId}`;

    return await fetch(url, {
      method: "DELETE",
    });
  }

  async APIMsg(channel: Channel, content: any) {
    const { data, files } = await APIMessage.create(
      //@ts-ignore
      this.client.channels.resolve(channel.id),
      content
    )
      .resolveData()
      .resolveFiles();
    return { ...data, files };
  }
}

export default Slashcord;
export { Command, Interaction };
