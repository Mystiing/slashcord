import { Client, PermissionResolvable } from "discord.js";
import { OpenMode } from "fs";
import Slashcord from "../../Index";
import Interaction from "../Interaction";

enum OptionsTypes {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
}

type Choices = {
  name: string;
  value: string;
};

type Options = {
  type: OptionsTypes;
  name: string;
  description: string;
  required?: boolean;
  choices?: Choices[];
  options?: Options[];
};

type Arguments = {
  name: string;
  value: string;
  type: 6;
};
interface Command {
  /** The name of the slash command. */
  name?: string;
  /** The description of the slash command. */
  description: string;
  /** Whether or not the slash command can be ran in testServers. */
  testOnly?: boolean;
  /** The permissions the member needs to run the slash command. */
  memberPerms?: PermissionResolvable[];
  /** The options the member might need to run this command. */
  options?: Options[];
  /** The execute function for the slash command. */
  execute: ({
    interaction,
    args,
    client,
    handler,
  }: {
    interaction: Interaction;
    args: Arguments[];
    client: Client;
    handler: Slashcord;
  }) => any;
}

class Command {
  constructor({
    description,
    execute,
    name,
    testOnly,
    memberPerms,
    options,
  }: Command) {
    this.name = name;
    this.execute = execute;
    this.description = description;
    this.testOnly = testOnly;
    this.memberPerms = memberPerms;
    this.options = options;
  }
}

export default Command;
export type { Options };
