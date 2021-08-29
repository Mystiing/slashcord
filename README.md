![Logo](https://cdn.discordapp.com/attachments/857360403150274630/860302967278272522/Untitled.png)

<div align="center">
    <h2>slashcord</h2>
    <p>Super-powered slash command handler made for discord.js!</p>
    <img src="https://forthebadge.com/images/badges/made-with-typescript.svg" />
    <img src="https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg">
  </a>
</div>

## Installation

> Node.js 16.6.0 or newer is required

```bash
# With NPM
npm install slashcord
# Alternatively, with yarn
yarn add slashcord
```

## Setup

When using Slashcord, require it using the following ways:

```js
// Using CommonJS
const Slashcord = require("slashcord");
// With ESM
import Slashcord from "slashcord";
```

You can use this example provided below:

```js
// You can use CommonJS for this example
import Slashcord from "slashcord";
import { Client, Intents } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
  console.log("Ready!");
  new Slashcord(client, {
    commandsDir: "commands",
  });
});

client.login("super secret token");
```

## Creating A Command

Creating a command with **Slashcord** is rather simple, you can do in 2 ways.

### Easy Way

```js
const slash = new Slashcord(client, {
  commandsDir: "commands",
});

// Keep in mind, there must be an async function of some sort.
await slash.create({
  name: "ping",
  description: "ping? what else.",
  args: [],
  guildId: "optional",
  type: "CHAT_INPUT",
});
```

Let's go over our parameters:

Name ➜ The name of the slash command [REQUIRED]

Description ➜ The description of the slash command [REQUIRED]

Options ➜ The options of the slash command [OPTIONAL]

Guild ID ➜ The guild ID for the slash command [OPTIONAL]

### Complex Way

```js
/* Somewhere in your commands folder
 * Name: "ping.js"
 * NOTE: the file name is the command name, but you can configure it.
 */

module.exports = {
  // name: "ping",
  description: "Simple pong?",
  execute: ({ interaction, args, client }) => {
    interaction.reply("Pong!");
  },
};
```

# Everything else can be found on the guide that discord.js made!

https://discord.io/mystiing
