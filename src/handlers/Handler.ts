import { existsSync } from "fs";
import { isAbsolute, join } from "path";
import Slashcord from "../Index";
import getFiles from "../utils/getFiles";
import Interaction from "../utils/Interaction";

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
    handler.client.ws.on("INTERACTION_CREATE", (interaction) => {
      interaction = new Interaction(interaction, handler.client, handler);
      const cmd = handler.commands.get(interaction.data.name);
      if (!cmd) return;
      const args = interaction.data.options;
      cmd.execute(interaction, args, handler.client, handler);
    });
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
