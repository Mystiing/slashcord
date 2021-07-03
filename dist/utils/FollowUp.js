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
class FollowUp {
    constructor(interaction, client, handler) {
        this.id = interaction.id;
        this.token = interaction.token;
        this.client = client;
        this.handler = handler;
        this.channel = interaction.channel;
        this.guild = interaction.guild;
    }
    /**
     * Sending a follow up message, seems cool!
     * @example
     * <caption><b>Without ephemeral responses</b></caption>
     * const embed = new MessageEmbed()
     * .setAuthor('some author')
     *
     * interaction.reply('Some reply.')
     * interaction.followUp.send(embed)
     *
     * @example
     * <caption><b>With ephemeral responses</b></caption>
     * const embed = new MessageEmbed()
     * .setAuthor('some author')
     *
     * interaction.reply('Some reply.')
     * interaction.followUp.send(embed, { ephemeral: true })
     */
    send(content, options) {
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
                data.embeds = options.embeds;
            }
            if (options === null || options === void 0 ? void 0 : options.ephemeral) {
                data.flags = 64;
            }
            const res = (yield node_fetch_1.default(`https://discord.com/api/v9/webhooks/${this.client.user.id}/${this.token}`, {
                method: "POST",
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })).json();
            const message = yield ((_c = this.channel) === null || _c === void 0 ? void 0 : _c.messages.fetch((yield res).id));
            return message;
        });
    }
    edit(content, options) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!content && !(options === null || options === void 0 ? void 0 : options.embeds)) {
                throw new Error("Content cannot be empty.");
            }
            if (!(options === null || options === void 0 ? void 0 : options.messageId)) {
                throw new Error("Please specify a message ID in the options, see here: https://github.com/Mystiing/slashcord/wiki/Followups");
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
                data.embeds = options.embeds;
            }
            const res = (yield node_fetch_1.default(`https://discord.com/api/v9/webhooks/${(_c = this.client.user) === null || _c === void 0 ? void 0 : _c.id}/${this.token}/messages/${options.messageId}`, {
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    "Content-Type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify(data),
            })).json();
            const msg = yield ((_d = this.channel) === null || _d === void 0 ? void 0 : _d.messages.fetch((yield res).id));
            return msg;
        });
    }
    delete(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(options === null || options === void 0 ? void 0 : options.messageId)) {
                throw new Error("Please specify a message ID in the options, see here: https://github.com/Mystiing/slashcord/wiki/Followups");
            }
            if (options.timeout) {
                return setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    yield node_fetch_1.default(`https://discord.com/api/v9/webhooks/${(_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id}/${this.token}/messages/${options.messageId}`, {
                        headers: { Authorization: `Bot ${this.client.token}` },
                        method: "DELETE",
                    });
                }), options.timeout);
            }
            else {
                return yield node_fetch_1.default(`https://discord.com/api/v9/webhooks/${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id}/${this.token}/messages/${options.messageId}`, {
                    headers: { Authorization: `Bot ${this.client.token}` },
                    method: "DELETE",
                });
            }
        });
    }
}
exports.default = FollowUp;
