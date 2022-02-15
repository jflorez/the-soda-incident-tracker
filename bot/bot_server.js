require('dotenv').config();
const { insertIncident, getLatestIncident, getCurrentIncidents } = require('../db/db_connector');
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
	if (item) {
		await insertIncident(message.member.displayName, item);
		message.channel.send(`${message.member.displayName} your ${item} tracker is now back to zero`);
	} else {
		message.channel.send(`${message.member.displayName} first start a tracker with !track`);
	}
};
bots['!progress'] = async function(message, arg) {
	const {user, item, oops} = await getLatestIncident(message.member.displayName);
	if(oops) {
		const oopsDate = new Date(oops);
		const now = new Date();
		const days = Math.floor((now - oopsDate)/(1000 * 60 * 60 * 24));
		message.channel.send(`${message.member.displayName} it has been ${days} days since your last ${item}`);
	} else {
		message.channel.send(`${message.member.displayName} first start a tracker with !track`);
	}
};

bots['!stats'] = async function(message, arg) {
	const {user, item, oops} = await getLatestIncident(message.member.displayName);
	if(oops) {
		const oopsDate = new Date(oops);
		const now = new Date();
		const hours = Math.floor((now - oopsDate)/(1000 * 60 * 60));
		const rows = await getCurrentIncidents(message.member.displayName, item);
		message.channel.send(`${message.member.displayName} you have called !oops ${rows.length} times since you started your tracker for ${item}.\n
			It has been ${hours} since your last !oops`);
	} else {
		message.channel.send(`${message.member.displayName} first start a tracker with !track`);
	}
}

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
