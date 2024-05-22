const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        // fetch and delete all guild commands
        const guilds = await client.guilds.fetch();

        for (const [guildId] of guilds) {
            const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
            for (const command of guildCommands) {
                await rest.delete(`${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`);
                console.log(`Deleted guild command ${command.name} in guild ${guildId}`);
            }
        }

        // fetch and delete all global commands
        const globalCommands = await rest.get(Routes.applicationCommands(clientId));
        for (const command of globalCommands) {
            await rest.delete(`${Routes.applicationCommands(clientId)}/${command.id}`);
            console.log(`Deleted global command ${command.name}`);
        }
        
        console.log('All commands deleted successfully.');
    } catch (error) {
        console.error('Error while deleting commands:', error);
    }

    client.destroy();
});

client.login(token);
