require('dotenv').config();
const { Client, Intents } = require('discord.js');
const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const bots = {};
bots['!track'] = function(message, arg) {
	message.channel.send(`I'm tracking ${message.member.displayName} for ${arg} incidents`);
};
bots['!oops'] = function(message, arg) {
	message.channel.send(`So you (${message.member.displayName}) caved and had a soda? back to zero`);
};
bots['!incident'] = function(message, arg) {
	message.channel.send(`You (${message.member.displayName}) have not had a soda in this many days`);
};

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', message => {
	const {content} = message;
	const [command, arg='soda'] = content.split(' ', 2);
	if(command in bots) {
		bots[command](message, arg);
	}
});

client.login(token);
