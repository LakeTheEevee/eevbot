'use strict';

const { readdirSync, statSync, readdir } = require('fs');

/*
  This is an example for an event.
  There will always be the client object and the additional arguments of the specific event available.
 */
module.exports = {
  once: true,
  execute: client => {
    // This will consider the bot process as 'online' (only if running with pm2)
    if (typeof process.send === 'function') process.send('ready');

      const { interactions, application } = client;
      const interactionFiles = readdirSync('./src/interactions', {withFileTypes: true}) // .filter(file => file.endsWith('.js'));
      for (const file of interactionFiles) {
        try {
          console.log(`Loading folder ${file.name}...`.bold.cyan);
          let dir = readdirSync(`./src/interactions/${file.name}`, {withFileTypes: true})
          for (const file2 of dir) {
            if (file2.name.endsWith('.js')) {
              try { 
                const interaction = require(`../../src/interactions/${file.name}/${file2.name}`);
                interactions.set(interaction.data.name, interaction);
                console.log(`Loaded interaction ${interaction.data.name}`.bold.green);
              } catch (e) {
                console.log(`Failed to load interaction ${file.name}/${file2.name}`.bold.white);
                console.log(e)
            }
          }
        }
      } catch (e) {
        console.log(`Failed to load interaction ${file}`.bold.red);
        console.log(e)
      }
    }
    return application.commands?.set([...interactions.map(i => i.data)]);
  }
};