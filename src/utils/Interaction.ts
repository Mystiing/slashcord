import {
  Channel,
  Client,
  Guild,
  GuildMember,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import fetch from "node-fetch";
import Slashcord from "../Index";

type Options = {
  embeds?: object[];
  type?: number;
  ephemeral?: boolean;
  flags?: boolean;
  tts?: boolean;
};

type DataOptions = {
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

class Interaction {
  constructor(interaction: any, client: Client, handler: Slashcord) {
    // Important stuff goes here.
    this.version = interaction.version;
    this.type = interaction.type;
    this.token = interaction.token;

    this.guildID = interaction.guild_id;
    this.channelID = interaction.channel_id;
    this.applicationID = interaction.application_id;

    this.guild = client.guilds.cache.get(this.guildID)!;
    this.channel = this.guild.channels.cache.get(this.channelID) as TextChannel;
    this.member = this.guild.members.add(interaction.member);

    this.handler = handler;
    this.client = client;

    this.data = interaction.data;
    this.id = interaction.id;
  }

  /**
   * Replying to an interaction sent by the user.
   * @example
   * interaction.reply("Hey!")
   */
  async reply(content: any, options?: Options) {
    if (!content && !options?.embeds) {
      throw new Error("Content cannot be empty.");
    }

    let data: any = {
      content: content,
      flags: undefined,
      tts: undefined,
      embeds: undefined,
    };

    if (typeof content === "object") {
      const embed = new MessageEmbed(content);
      data = await this.handler.APIMsg(this.channel!, embed);
    }

    data.flags = options?.flags ?? undefined;
    data.tts = options?.tts ?? false;
    if (options?.embeds) {
      data.embeds = [options.embeds];
    }

    const input = {
      type: options?.type ?? 4,
      data,
    };

    return await fetch(
      `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
      {
        body: JSON.stringify(input),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export default Interaction;
