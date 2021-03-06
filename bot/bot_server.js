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
		const now = new Date();
		const days = Math.floor((now - oops)/(1000 * 60 * 60 * 24));
		message.channel.send(`${message.member.displayName} it has been ${days} days since your last ${item}`);
	} else {
		message.channel.send(`${message.member.displayName} first start a tracker with !track`);
	}
};

bots['!stats'] = async function(message, arg) {
	const {user, item, oops} = await getLatestIncident(message.member.displayName);
	if(oops) {
		const now = new Date();
		const hours = Math.floor((now - oops)/(1000 * 60 * 60));
		const rows = await getCurrentIncidents(message.member.displayName, item);
		let gap = now - oops;
        for(entry of rows) {
            if(rows.indexOf(entry) < rows.length-1) {
                const currentGap = rows[rows.indexOf(entry)+1].oops - entry.oops;
                gap = currentGap>gap ? currentGap : gap;
            }
        }
		message.channel.send(`${message.member.displayName} you have called !oops ${rows.length - 1} times since you started your tracker for ${item}.\nIt has been ${hours} hours since your last !oops\nYour longest streak is ${(gap/1000/60/60/24).toFixed(1)} days`);
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
