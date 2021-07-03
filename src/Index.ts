import { APIMessage, Channel, Client, Collection } from "discord.js";
import EventEmitter from "events";
import { Handler } from "./handlers/Handler";
import Options from "./Options";

import fetch from "node-fetch";
import Interaction from "./utils/Interaction";

class Slashcord {
  public client: Client;

  public commandsDir: string = "./commands";
  public testServers: string[] = [];

  public commands: Collection<string, any> = new Collection();

  static Interaction: Interaction;
  constructor(client: Client, options: Options) {
    /** If no client was provided, we warn them. */
    if (!client) {
      throw new Error("Please provide a valid Discord.JS client.");
    }

    this.client = client;
    this.commandsDir = options?.commandsDir ?? "./commands";

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
      url += `/guilds/${guildId}/commands`;
    }
    url += "/commands";

    return (
      await fetch(url, {
        headers: { Authorization: `Bot ${this.client.token}` },
      })
    ).json();
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
    guildId?: string
  ) {
    const appId = this.client.user?.id;

    let url = `https://discord.com/api/v9/applications/${appId}`;
    if (guildId) {
      url += `/guilds/${guildId}/commands`;
    }
    url += `/commands`;

    let data = {
      name,
      description,
      options,
    };

    return (
      await fetch(url, {
        body: JSON.stringify(data),
        method: "POST",
        headers: { Authorization: `Bot ${this.client.token}` },
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
      url += `/guilds/${guildId}/commands/${commandId}`;
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

export = Slashcord;
