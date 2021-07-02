![Logo](https://cdn.discordapp.com/attachments/857360403150274630/860302967278272522/Untitled.png)

<div align="center">
    <h2>slashcord</h2>
    <p>Super-powered slash command handler made for discord.js!</p>
    <img src="https://forthebadge.com/images/badges/made-with-typescript.svg" />
    <img src="https://forthebadge.com/images/badges/built-by-developers.svg" />
    <img src="https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg">
  </a>
</div>

## Installation

```bash
npm install slashcord
```

## Setup

When installing slashcord, you should consider the following setup:

```js
// With CommonJS
const Slashcord = require("slashcord");
// With ESM
import Slashcord from "slashcord";
```

Please keep in mind, Node v14 and higher is required.

```js
const Slashcord = require("slashcord");
const { Client } = require("discord.js");

// Declaring our new client.
const client = new Client();

client.on("ready", () => {
  new Slashcord(client, {
    commandsDir: "commands",
  });
});

client.login("super secret token!");
```

## Creating A Command

### Easy Way

We can create a command in two different ways, I will list them both.

```js
const slash = new Slashcord(client, {
  commandsDir: "commands",
});

// Creating a command the simple way.
slash.create("name", "description", [], "opt guild ID");
```

Let's go over our parameters:

Name ➜ The name of the slash command **[REQUIRED]**

Description ➜ The description of the slash command **[REQUIRED]**

Options ➜ The options of the slash command **[OPTIONAL]**

Guild ID ➜ The guild ID for the slash command **[OPTIONAL]**

> We will provide support for arrays of guild ID's, soon.

### More Complex Way

This way provides support for replies and more indetail properties.

```js
/* Somewhere in your commands folder
 * Name: "ping.js"
 * NOTE: the file name is the command name, but you can configure it.
 */

module.exports = {
  // name: "ping",
  description: "Simple pong?",
  async execute(interaction) {
    interaction.reply("Pong!");
  },
};
```

## Replying

Within your command execute function, you can reply with ease.

```js
// Without ephemeral responses
const embed = new MessageEmbed().setTitle("some title");
interaction.reply(embed);

// With ephemeral responses
const embed = new MessageEmbed().setTitle("some title");
interaction.reply(embed, { ephemeral: true });
```

## Editing

Editing an interaction response is simple, assuming you replied to the user.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
