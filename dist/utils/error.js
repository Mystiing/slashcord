"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SlashError extends Error {
    constructor(message) {
        super();
        (this.name = "SlashError"), (this.message = message);
    }
}
exports.default = SlashError;
