require('dotenv').config();
const { insertIncident, getLatestIncident } = require('../db/db_connector');
const { Client, Intents } = require('discord.js');
const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const bots = {};
bots['!track'] = async function(message, arg) {
	await insertIncident(message.member.displayName, arg);
	message.channel.send(`${message.member.displayName} you are now tracking days without ${arg}`);
};
bots['!oops'] = async function(message, arg) {
	const {user, item, oops} = await getLatestIncident(message.member.displayName);
	await insertIncident(message.member.displayName, item);
	message.channel.send(`${message.member.displayName} your ${item} tracker is now back to zero`);
};
bots['!progress'] = async function(message, arg) {
	const {user, item, oops} = await getLatestIncident(message.member.displayName);
	const oopsDate = new Date(oops);
	const now = new Date();
	const days = Math.floor((now - oopsDate)/(1000 * 60 * 60 * 24));
	message.channel.send(`${message.member.displayName} is has been ${days} days since your last ${item}`);
};

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async message =>  {
	const {content} = message;
	const [command, arg='soda'] = content.split(' ', 2);
	if(command in bots) {
		await bots[command](message, arg);
	}
});

client.login(token);
