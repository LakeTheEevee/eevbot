'use strict';

require('colors');
require('dotenv').config()
const keepAlive = require('../server');
const { readdirSync } = require('fs');
const { Client, Collection } = require('discord.js');
const discord = require('discord.js');
const { token, replitOn } = require('../config'); 

const client = new Client({
  // https://discordjs.guide/popular-topics/intents.html#gateway-intents
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  retryLimit: Infinity,
});
client.interactions = new Collection();

const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const eventName = file.split('.')[0];
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(eventName, (...args) => event.execute(client, ...args));
  } else {
    client.on(eventName, (...args) => event.execute(client, ...args));
  }
}

process.on('SIGINT', () => {
  console.log('Stopping bot...'.bold.red);
  // end database connection
  client.destroy();
  process.exit(0);
});

client.login(token).then(() => {
  if (replitOn === true) {
    keepAlive();
    console.log('Repl.it server is ready!'.bold.green);
  }
  console.log('The bot has started'.bold.cyan);
});

module.exports = client;


