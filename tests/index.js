const Slashcord = require('../dist/index');
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] })

client.on('ready', () => {
    console.log('hi')
    const slash = new Slashcord(client, {
        commandsDir: 'commands'
    })
})

client.login("ODU1OTkyMDUwMjcyMzA1MTUz.YM6iuA.t1x-WkzMJS8Y_ZznYsTAebX7iiE")

