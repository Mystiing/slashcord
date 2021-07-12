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
declare class AppCommand {
    constructor(command: any);
}
export default AppCommand;
