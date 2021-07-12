"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = exports.Command = void 0;
const discord_js_1 = require("discord.js");
const Handler_1 = require("./handlers/Handler");
const node_fetch_1 = __importDefault(require("node-fetch"));
const Interaction_1 = __importDefault(require("./utils/Interaction"));
exports.Interaction = Interaction_1.default;
const Command_1 = __importDefault(require("./utils/other/Command"));
exports.Command = Command_1.default;
class Slashcord {
    constructor(client, options) {
        var _a, _b, _c;
        this.commandsDir = "./commands";
        this.testServers = [];
        this.commands = new discord_js_1.Collection();
        this.permissionError = "You don't have the {PERMISSION} permission to use that.";
        /** If no client was provided, we warn them. */
        if (!client) {
            throw new Error("Please provide a valid Discord.JS client.");
        }
        this.client = client;
        this.commandsDir = (_a = options === null || options === void 0 ? void 0 : options.commandsDir) !== null && _a !== void 0 ? _a : "./commands";
        this.permissionError =
            (_c = (_b = options === null || options === void 0 ? void 0 : options.customSettings) === null || _b === void 0 ? void 0 : _b.permissionError) !== null && _c !== void 0 ? _c : "You don't have the {PERMISSION} permission to use that.";
        if (options.testServers) {
            if (typeof options.testServers === "string") {
                options.testServers = [options.testServers];
            }
            this.testServers = options.testServers;
        }
        new Handler_1.Handler(this, this.commandsDir);
    }
    /**
     * Get commands from a guild, or globally.
     * @example
     * <caption>Without guild ID's</caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.get()
     * @example
     * <caption>With guild ID's</caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.get("id")
     */
    get(guildId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const appId = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id;
            let url = `https://discord.com/api/v9/applications/${appId}`;
            if (guildId) {
                url += `/guilds/${guildId}`;
            }
            url += "/commands";
            const res = yield (yield node_fetch_1.default(url, {
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    "Content-Type": "application/json",
                },
            })).json();
            // let cmd;
            // res.forEach((command: any) => {
            //   cmd = new AppCommand(command);
            //   return cmd;
            // });
            return res;
        });
    }
    /**
     * Creating a command globally, or guild only.
     * @example
     * <caption> Without guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.create("ping", "pong!", [])
     * @example
     * <caption> With guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.create("ping", "pong", [], "id")
     */
    create(name, description, options = [], guildId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const appId = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id;
            let url = `https://discord.com/api/v9/applications/${appId}`;
            if (guildId) {
                url += `/guilds/${guildId}`;
            }
            url += `/commands`;
            let data = {
                name,
                description,
                options,
            };
            return yield (yield node_fetch_1.default(url, {
                body: JSON.stringify(data),
                method: "POST",
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    "Content-Type": "application/json",
                },
            })).json();
        });
    }
    /**
     * Deleting a command globally, or guild only.
     * @example
     * <caption> Without guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.delete("command id")
     * @example
     * <caption> With guild ID's </caption>
     * const slash = new Slashcord(client, { commandsDir: "./commands" })
     * slash.delete("command id", "guild id")
     */
    delete(commandId, guildId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const appId = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id;
            let url = `https://discord.com/api/v9/applications/${appId}`;
            if (guildId) {
                url += `/guilds/${guildId}`;
            }
            url = `/commands/${commandId}`;
            return yield node_fetch_1.default(url, {
                method: "DELETE",
            });
        });
    }
    APIMsg(channel, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, files } = yield discord_js_1.APIMessage.create(
            //@ts-ignore
            this.client.channels.resolve(channel.id), content)
                .resolveData()
                .resolveFiles();
            return Object.assign(Object.assign({}, data), { files });
        });
    }
}
exports.default = Slashcord;
