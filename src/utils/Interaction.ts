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
import FollowUp from "./FollowUp";

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
  channel: TextChannel | undefined;
  id: string;
  guildID: string;
  data: DataOptions[];
  channelID: string;
  applicationID: string;
  handler: Slashcord;
  _followUp: FollowUp;
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

    if (options?.ephemeral) {
      data.flags = 64;
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
  async edit(content: any, options?: Options) {
    if (!content && !options?.embeds) {
      throw new Error("Content cannot be empty.");
    }

    if (options?.ephemeral) {
      throw new Error(
        "You cannot edit a normal interaction response to become a ephemeral response."
      );
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

    return await fetch(
      `https://discord.com/api/v9/webhooks/${this.client.user?.id}/${this.token}/messages/@original`,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        method: "PATCH",
      }
    );
  }
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
  async delete(options?: { timeout: number }) {
    let url = `https://discord.com/api/v9/webhooks/${this.client.user?.id}/${this.token}/messages/@original`;
    if (options?.timeout) {
      setTimeout(async () => {
        await fetch(url, {
          headers: { Authorization: `Bot ${this.client.token}` },
          method: "DELETE",
        });
      }, options.timeout);
    } else {
      await fetch(url, {
        headers: { Authorization: `Bot ${this.client.token}` },
        method: "DELETE",
      });
    }
  }
  /**
   * We are think about what we need to say.
   * NOTE: We need to edit the response!
   * @example
   * interaction.thinking()
   * await interaction.edit("I was thinking.")
   */
  async thinking() {
    const input = {
      type: 5,
    };

    await fetch(
      `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
      {
        body: JSON.stringify(input),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  async fetchReply() {
    const url = `https://discord.com/api/v9/webhooks/${this.client.user?.id}/${this.token}/messages/@original`;
    const res = (
      await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bot ${this.client.token}`,
          "Content-Type": "application/json",
        },
      })
    ).json();
    //@ts-ignore
    const message = await this.channel!.messages.fetch(res.id);
    return message;
  }

  get followUp() {
    return this._followUp;
  }
}

export default Interaction;
