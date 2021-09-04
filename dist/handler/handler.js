"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs_1 = require("fs");
const path_1 = require("path");
const error_1 = __importDefault(require("../utils/error"));
const getFiles_1 = __importDefault(require("../utils/getFiles"));
const hasPerm = require('../js/permission.js');
class Handler {
    constructor(handler, rawDir) {
        this.client = handler.client;
        this.handler = handler;
        const dir = (0, path_1.isAbsolute)(rawDir) ? rawDir : (0, path_1.join)(require.main.path, rawDir);
        if (!(0, fs_1.existsSync)(dir)) {
            throw new error_1.default(`The command directory: "${rawDir}" doesn't exist!`);
        }
        const files = (0, getFiles_1.default)(dir);
        for (const [file, fileName] of files) {
            this.register(file, fileName);
        }
        this.client.on("interactionCreate", (interaction) => {
            var _a;
            if (!interaction.isCommand())
                return;
            if (!((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.isText()))
                return;
            const cmdName = interaction.commandName.toLowerCase();
            const args = interaction.options;
            const command = this.handler.commands.get(cmdName);
            if (!command)
                return;
            let permcheck = hasPerm(command, interaction);
            switch (permcheck) {
                case 'MemberPermissionsError':
                    interaction.reply(`Insufficient member perimissions \`${command.extras.memberPerms}\``);
                    return;
                    break;
                case 'ClientPermissionsError':
                    interaction.reply(`Insufficient client perimissions \`${command.extras.clientPerms}\``);
                    return;
                    break;
            }
            // Insufficient member perimissions \`${command.extras.memberPerms}\`
            let client = this.client;
            command.execute({ interaction, args, client });
            this.handler.emit("interaction", interaction, command);
        });
    }
    register(file, fileName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const command = (yield Promise.resolve().then(() => __importStar(require(file)))).default;
            const { name = fileName, description, options, testOnly, extras } = command;
            if (!description) {
                throw new error_1.default(`Please specify a description for the command: "${name}"`);
            }
            if (testOnly && !this.handler.testServers.length) {
                throw new error_1.default(`The command: "${name}" has the testOnly feature, but no test servers were specified.`);
            }
            if (testOnly) {
                for (const server of this.handler.testServers) {
                    const guild = yield this.client.guilds.fetch(server);
                    if (!guild) {
                        throw new error_1.default(`The ID: "${server}" is not a valid guild ID.`);
                    }
                    this.handler.commands.set(name, command);
                    return yield guild.commands.create({
                        name,
                        description,
                        options,
                        type: (extras === null || extras === void 0 ? void 0 : extras.type) || "CHAT_INPUT",
                    });
                }
            }
            else {
                this.handler.commands.set(name, command);
                (_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.create({
                    name,
                    description,
                    options,
                    type: (extras === null || extras === void 0 ? void 0 : extras.type) || "CHAT_INPUT",
                });
            }
        });
    }
}
exports.default = Handler;
