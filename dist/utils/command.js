"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefabCommand = void 0;
class PrefabCommand {
    constructor(client, { name = "", description = "", category = "Other", clientPerms = [], devOnly = false, cooldown = 0, guildOnly = true, memberPerms = [], options = [], nsfw = false, testOnly = false, }) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.client = client;
        this.options = options;
        this.clientPerms = clientPerms;
        this.devOnly = devOnly;
        this.cooldown = cooldown;
        this.guildOnly = guildOnly;
        (this.memberPerms = memberPerms), (this.nsfw = nsfw);
        this.testOnly = testOnly;
    }
}
exports.PrefabCommand = PrefabCommand;
