import { Client, Guild, MessageEmbed, TextChannel } from "discord.js";
import fetch from "node-fetch";
import Slashcord from "../Index";
import Interaction from "./Interaction";

type Options = {
  embeds?: object[];
  ephemeral?: boolean;
  flags?: boolean;
  tts?: boolean;
};

type EditOptions = {
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

class FollowUp {
  constructor(interaction: Interaction, client: Client, handler: Slashcord) {
    this.id = interaction.id;
    this.token = interaction.token;
    this.client = client;
    this.handler = handler;
    this.channel = interaction.channel!;
    this.guild = interaction.guild!;
  }
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
  async send(content: any, options?: Options) {
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
      data.embeds = options.embeds;
    }
    if (options?.ephemeral) {
      data.flags = 64;
    }
    const res = (
      await fetch(
        `https://discord.com/api/v9/webhooks/${this.client.user!.id}/${
          this.token
        }`,
        {
          method: "POST",
          headers: {
            Authorization: `Bot ${this.client.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
    ).json();
    const message = await this.channel?.messages.fetch((await res).id);
    return message;
  }
  async edit(content: any, options: EditOptions) {
    if (!content && !options?.embeds) {
      throw new Error("Content cannot be empty.");
    }

    if (!options?.messageId) {
      throw new Error(
        "Please specify a message ID in the options, see here: https://github.com/Mystiing/slashcord/wiki/Followups"
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
      data.embeds = options.embeds;
    }

    const res = (
      await fetch(
        `https://discord.com/api/v9/webhooks/${this.client.user?.id}/${this.token}/messages/${options.messageId}`,
        {
          headers: {
            Authorization: `Bot ${this.client.token}`,
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify(data),
        }
      )
    ).json();

    const msg = await this.channel?.messages.fetch((await res).id);
    return msg;
  }
  async delete(options: { messageId: string; timeout?: number }) {
    if (!options?.messageId) {
      throw new Error(
        "Please specify a message ID in the options, see here: https://github.com/Mystiing/slashcord/wiki/Followups"
      );
    }

    if (options.timeout) {
      return setTimeout(async () => {
        await fetch(
          `https://discord.com/api/v9/webhooks/${this.client.user?.id}/${this.token}/messages/${options.messageId}`,
          {
            headers: { Authorization: `Bot ${this.client.token}` },
            method: "DELETE",
          }
        );
      }, options.timeout);
    } else {
      return await fetch(
        `https://discord.com/api/v9/webhooks/${this.client.user?.id}/${this.token}/messages/${options.messageId}`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
          method: "DELETE",
        }
      );
    }
  }
}

export default FollowUp;
