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
const discord_js_1 = require("discord.js");
const events_1 = __importDefault(require("events"));
const handler_1 = __importDefault(require("./handler/handler"));
const error_1 = __importDefault(require("./utils/error"));
class Slashcord extends events_1.default {
    constructor(client, options) {
        super();
        this.commandsDir = "./commands";
        this.testServers = [];
        this.commands = new discord_js_1.Collection();
        if (!client) {
            throw new error_1.default("You must provide a valid client in the first parameter.");
        }
        this.client = client;
        this.commandsDir = options.commandsDir || "./commands";
        if (options.testServers) {
            if (typeof options.testServers === "string") {
                options.testServers = [options.testServers];
            }
            this.testServers = options.testServers;
        }
        new handler_1.default(this, this.commandsDir);
    }
    get(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                const commands = yield ((_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.fetch());
                return commands;
            }
            if (options.guildId) {
                const guild = yield this.client.guilds.fetch(options.guildId);
                if (!guild) {
                    throw new error_1.default("The guild ID provided was not a valid guild!");
                }
                const commands = yield guild.commands.fetch();
                return commands;
            }
            if (options.commandId) {
                const command = yield ((_b = this.client.application) === null || _b === void 0 ? void 0 : _b.commands.fetch(options.commandId));
                if (!command) {
                    throw new error_1.default("The command ID provided was not a valid command!");
                }
                return command;
            }
            if (options.guildId && options.commandId) {
                const guild = yield this.client.guilds.fetch(options.guildId);
                if (!guild) {
                    throw new error_1.default("The guild ID provided was not a valid guild!");
                }
                const command = yield guild.commands.fetch(options.commandId);
                if (!command) {
                    throw new error_1.default("The command ID provided was not a valid command!");
                }
                return command;
            }
        });
    }
    create(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, args = [], guildId = "", type = "CHAT_INPUT", } = options;
            if (guildId) {
                const guild = yield this.client.guilds.fetch(guildId);
                if (!guild) {
                    throw new error_1.default("The guild ID provided was not a valid guild!");
                }
                const command = yield guild.commands.create({
                    name,
                    description,
                    options: args,
                    type,
                });
                return command;
            }
            return yield ((_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.create({
                name,
                description,
                options: args,
                type,
            }));
        });
    }
    delete(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (options.guildId) {
                const guild = yield this.client.guilds.fetch(options.guildId);
                if (!guild) {
                    throw new error_1.default("The guild ID provided was not a valid guild!");
                }
                const command = yield guild.commands.fetch(options.commandId);
                if (!command) {
                    throw new error_1.default("The command ID provided was not a valid command!");
                }
                return yield command.delete();
            }
            const command = yield ((_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.fetch(options.commandId));
            if (!command) {
                throw new error_1.default("The command ID provided was not a valid command!");
            }
            return yield command.delete();
        });
    }
}
exports.default = Slashcord;
module.exports = Slashcord;
