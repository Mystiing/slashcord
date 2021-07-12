import { existsSync } from "fs";
import { isAbsolute, join } from "path";
import Slashcord from "../Index";
import FollowUp from "../utils/FollowUp";
import getFiles from "../utils/other/getFiles";
import Interaction from "../utils/Interaction";
import { GuildMember, PermissionResolvable } from "discord.js";

class Handler {
  constructor(handler: Slashcord, dir: string) {
    const directory = isAbsolute(dir) ? dir : join(require.main!.path, dir);
    if (!existsSync(directory)) {
      throw new Error(
        `Please provide a valid directory, "${dir}" doesn't exist.`
      );
    }

    const files = getFiles(directory);
    if (files.length <= 0) return;
    console.log(
      `Slashcord > Loaded ${files.length} command${
        files.length === 1 ? "" : "s"
      }`
    );

    for (const [file, fileName] of files) {
      (async () => {
        await this.makeSlash(file, fileName, handler);
      })();
    }

    //@ts-ignore
    handler.client.ws.on(
      //@ts-ignore
      "INTERACTION_CREATE",
      async (interaction: Interaction) => {
        interaction = new Interaction(interaction, handler.client, handler);
        interaction.followUp = new FollowUp(
          interaction,
          handler.client,
          handler
        );
        //@ts-ignore
        const cmd = handler.commands.get(interaction.data.name);
        if (!cmd) return;

        if (
          cmd.memberPerms &&
          !interaction
            .channel!.permissionsFor(interaction.member!)!
            .has(cmd.memberPerms, true)
        ) {
          return interaction.reply(
            handler.permissionError.replace(
              /{PERMISSION}/g,
              await missingPermissions(interaction.member!, cmd.memberPerms)
            )
          );
        }

        //@ts-ignore
        const args = interaction.data.options;
        const client = handler.client;
        cmd.execute({ interaction, args, client, handler });
      }
    );
  }
  async makeSlash(file: string, fileName: string, handler: Slashcord) {
    const command = (await import(file)).default;
    const { name = fileName, description, options, testOnly } = command;

    if (!description) {
      throw new Error(`The command: "${name}" requires a description.`);
    }

    if (testOnly && !handler.testServers.length) {
      throw new Error(
        `The command: "${name}" has the "testOnly" feature, but no test servers are specified.`
      );
    }

    if (testOnly) {
      for (const server of handler.testServers) {
        handler.create(name, description, options, server);
        handler.commands.set(name, command);
      }
    }

    handler.create(name, description, options);
    handler.commands.set(name, command);
  }
}

export { Handler };

// credit goes to canta [https://github.com/canta-slaus/bot-prefab]
function missingPermissions(member: GuildMember, perms: PermissionResolvable) {
  const missingPerms = member.permissions.missing(perms).map(
    (str) =>
      `\`${str
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
  );

  return missingPerms.length > 1
    ? `${missingPerms.slice(0, -1).join(", ")} and ${missingPerms.slice(-1)[0]}`
    : missingPerms[0];
}
