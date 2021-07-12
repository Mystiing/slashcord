"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppCommand {
    constructor(command) {
        this.id = command.id;
        this.applicationID = command.application_id;
        this.name = command.name;
        this.description = command.description;
        this.defaultPermission = command.default_permission;
        this.type = command.type;
        this.version = command.version;
    }
}
exports.default = AppCommand;
