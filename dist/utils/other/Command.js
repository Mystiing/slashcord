"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsTypes;
(function (OptionsTypes) {
    OptionsTypes[OptionsTypes["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    OptionsTypes[OptionsTypes["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    OptionsTypes[OptionsTypes["STRING"] = 3] = "STRING";
    OptionsTypes[OptionsTypes["INTEGER"] = 4] = "INTEGER";
    OptionsTypes[OptionsTypes["BOOLEAN"] = 5] = "BOOLEAN";
    OptionsTypes[OptionsTypes["USER"] = 6] = "USER";
    OptionsTypes[OptionsTypes["CHANNEL"] = 7] = "CHANNEL";
    OptionsTypes[OptionsTypes["ROLE"] = 8] = "ROLE";
    OptionsTypes[OptionsTypes["MENTIONABLE"] = 9] = "MENTIONABLE";
})(OptionsTypes || (OptionsTypes = {}));
class Command {
    constructor({ description, execute, name, testOnly, memberPerms, options, }) {
        this.name = name;
        this.execute = execute;
        this.description = description;
        this.testOnly = testOnly;
        this.memberPerms = memberPerms;
        this.options = options;
    }
}
exports.default = Command;
