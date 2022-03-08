'use strict';

module.exports = {
  data: {
    name: 'ping',
    description: 'Returns the ping of the bot.',
  },
  execute: (interaction, client) => {
    return interaction.reply(`:ping_pong: Pong!\nAPI Ping: **\`${client.ws.ping} ms\`**`);
    // interaction.createdTimestamp - interaction.createdTimestamp
  },
};
