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
const Slashcord = require("slashcord").default;
// With ESM
import Slashcord from "slashcord";
```

Please keep in mind, Node v14 and higher is required.

```js
const Slashcord = require("slashcord").default;
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

This way provides support for replies and more detailed properties.

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

### Arguments

If the user were to provide arguments we would have to collect it like so:
```js
module.exports = {
    // name: "arguments",
    description: "A simple args command, with no meaning.",
     options: [{
         type: 3, // This is a string type.
         required: true, // Must be a boolean.
         name: "input", 
         description: "the input comin back."
     }],
    execute: async ({ interaction, args }) => {
        const input = args[0].value
        const embed = new MessageEmbed()
        .setAuthor('u thot')
        .setDescription(input)
        interaction.reply('kek', { embeds: [embed] })
    }
}
```
Using arguments means you need to use options property, which has all these properties:
Type ➜ The option type, check Discord API Docs REQUIRED
Required ➜ Whether or not the argument is required or not. OPTIONAL
Choices ➜ Check the "Choices" Page OPTIONAL
Name ➜  The name of the argument REQUIRED
Description ➜  The description of the argument. REQUIRED


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

```js
interaction.reply("Hey, wait...");
interaction.edit("Alright.");
```

> An error will be thrown if you haven't replied.

## Deleting

Deleting an interaction response is simple, it has options for you to use.

```js
// With options
interaction.reply("Ayo?");
// NOTE: The timeout must be in milliseconds.
interaction.delete({ timeout: 1000 });

// Without options
interaction.reply("Bye nub!");
interaction.delete();
```

## Fetching

Fetching our interaction response is pretty simple, make sure you `await` or use `.then`

```js
interaction.reply("React with 🍪");
const message = await interaction.fetchReply();
message.react("🍪");
```

# Thinking

We are thinking about what to say, to get rid of the message edit the message.

```js
// Without options
interaction.thinking();
await interaction.edit("Hey!");

// With options
interaction.thinking({ ephemeral: true });
await interaction.edit("Sus, only you can see it tho.");
```

> The edit will be ephemeral as well, if you set it in the options of the thinking method.

# Followups

Using followups in slashcord is pretty simple, just use the `followUp` property in the `interaction` object.
Some methods require you to get the message object out of them.

## Sending

Sending a followup is pretty simple, all you have to do is this:

```js
// Assuming your not going to edit your followUp
interaction.reply("Hey!");
interaction.followUp.send("WOAH!");
```

## Edit

Editing a followup is simple, but you need the `Message` object from it to use it.
NOTE: you also need the message object for the `delete` method.

```js
interaction.reply("Hey!");
const msg = await interaction.followUp.send("WOAH!");
// You can do your embeds, flags here as well :)
interaction.followUp.edit("WHAT HOW?", { messageId: msg.id });
```

> An error will be thrown if you didn't put the message ID.

> Visit here for more info: https://github.com/Mystiing/slashcord/wiki/Followups

## Deleting

As stated above:
Deleting a followup is simple, but you need the `Message` object from it to use it.

```js
interaction.reply("Hey!");
const msg = await interaction.followUp.send("WOAH!");
// Without timeouts
interaction.followUp.delete({ messageId: msg.id });
// With timeouts
interaction.followUp.delete({ messageId: msg.id, timeout: 1000 });
```

> An error will be thrown if you didn't put the message ID.

> Visit here for more info: https://github.com/Mystiing/slashcord/wiki/Followups

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
