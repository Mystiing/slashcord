import { Options } from "./other/Command";

interface AppCommand {
  id: string;
  applicationID: String;
  name: string;
  description: string;
  defaultPermission?: boolean;
  type: number;
  options?: Options;
  version?: string;
}

class AppCommand {
  constructor(command: any) {
    this.id = command.id;
    this.applicationID = command.application_id;
    this.name = command.name;
    this.description = command.description;
    this.defaultPermission = command.default_permission;
    this.type = command.type;
    this.version = command.version;
  }
}

export default AppCommand;
