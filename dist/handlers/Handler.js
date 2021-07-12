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
exports.Handler = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const FollowUp_1 = __importDefault(require("../utils/FollowUp"));
const getFiles_1 = __importDefault(require("../utils/other/getFiles"));
const Interaction_1 = __importDefault(require("../utils/Interaction"));
class Handler {
    constructor(handler, dir) {
        const directory = path_1.isAbsolute(dir) ? dir : path_1.join(require.main.path, dir);
        if (!fs_1.existsSync(directory)) {
            throw new Error(`Please provide a valid directory, "${dir}" doesn't exist.`);
        }
        const files = getFiles_1.default(directory);
        if (files.length <= 0)
            return;
        console.log(`Slashcord > Loaded ${files.length} command${files.length === 1 ? "" : "s"}`);
        for (const [file, fileName] of files) {
            (() => __awaiter(this, void 0, void 0, function* () {
                yield this.makeSlash(file, fileName, handler);
            }))();
        }
        //@ts-ignore
        handler.client.ws.on(
        //@ts-ignore
        "INTERACTION_CREATE", (interaction) => __awaiter(this, void 0, void 0, function* () {
            interaction = new Interaction_1.default(interaction, handler.client, handler);
            interaction.followUp = new FollowUp_1.default(interaction, handler.client, handler);
            //@ts-ignore
            const cmd = handler.commands.get(interaction.data.name);
            if (!cmd)
                return;
            if (cmd.memberPerms &&
                !interaction
                    .channel.permissionsFor(interaction.member)
                    .has(cmd.memberPerms, true)) {
                return interaction.reply(handler.permissionError.replace(/{PERMISSION}/g, yield missingPermissions(interaction.member, cmd.memberPerms)));
            }
            //@ts-ignore
            const args = interaction.data.options;
            const client = handler.client;
            cmd.execute({ interaction, args, client, handler });
        }));
    }
    makeSlash(file, fileName, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = (yield Promise.resolve().then(() => __importStar(require(file)))).default;
            const { name = fileName, description, options, testOnly } = command;
            if (!description) {
                throw new Error(`The command: "${name}" requires a description.`);
            }
            if (testOnly && !handler.testServers.length) {
                throw new Error(`The command: "${name}" has the "testOnly" feature, but no test servers are specified.`);
            }
            if (testOnly) {
                for (const server of handler.testServers) {
                    handler.create(name, description, options, server);
                    handler.commands.set(name, command);
                }
            }
            handler.create(name, description, options);
            handler.commands.set(name, command);
        });
    }
}
exports.Handler = Handler;
// credit goes to canta [https://github.com/canta-slaus/bot-prefab]
function missingPermissions(member, perms) {
    const missingPerms = member.permissions.missing(perms).map((str) => `\`${str
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``);
    return missingPerms.length > 1
        ? `${missingPerms.slice(0, -1).join(", ")} and ${missingPerms.slice(-1)[0]}`
        : missingPerms[0];
}
