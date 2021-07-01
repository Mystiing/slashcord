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
const node_fetch_1 = __importDefault(require("node-fetch"));
class Interaction {
    constructor(interaction, client, handler) {
        // Important stuff goes here.
        this.version = interaction.version;
        this.type = interaction.type;
        this.token = interaction.token;
        this.guildID = interaction.guild_id;
        this.channelID = interaction.channel_id;
        this.applicationID = interaction.application_id;
        this.guild = client.guilds.cache.get(this.guildID);
        this.channel = this.guild.channels.cache.get(this.channelID);
        this.member = this.guild.members.add(interaction.member);
        this.handler = handler;
        this.client = client;
        this.data = interaction.data;
        this.id = interaction.id;
    }
    /**
     * Replying to an interaction sent by the user.
     * @example
     * interaction.reply("Hey!")
     */
    reply(content, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!content && !(options === null || options === void 0 ? void 0 : options.embeds)) {
                throw new Error("Content cannot be empty.");
            }
            let data = {
                content: content,
                flags: undefined,
                tts: undefined,
                embeds: undefined,
            };
            if (typeof content === "object") {
                const embed = new discord_js_1.MessageEmbed(content);
                data = yield this.handler.APIMsg(this.channel, embed);
            }
            data.flags = (_a = options === null || options === void 0 ? void 0 : options.flags) !== null && _a !== void 0 ? _a : undefined;
            data.tts = (_b = options === null || options === void 0 ? void 0 : options.tts) !== null && _b !== void 0 ? _b : false;
            if (options === null || options === void 0 ? void 0 : options.embeds) {
                data.embeds = [options.embeds];
            }
            const input = {
                type: (_c = options === null || options === void 0 ? void 0 : options.type) !== null && _c !== void 0 ? _c : 4,
                data,
            };
            return yield node_fetch_1.default(`https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`, {
                body: JSON.stringify(input),
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
        });
    }
}
exports.default = Interaction;
