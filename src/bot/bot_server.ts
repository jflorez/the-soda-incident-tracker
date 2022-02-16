/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as dotenv from 'dotenv';
dotenv.config();

import DBConnector from 'src/db/db_connector';
import {Client, Intents} from 'discord.js';


const dbConnector = new DBConnector();

const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const bots = {};
bots['!track'] = async function(message: { member: { displayName: string; }; channel: { send: (arg0: string) => void; }; }, arg: string) {
    await dbConnector.insertIncident(message.member.displayName, arg);
    message.channel.send(`${message.member.displayName} you are now tracking days without ${arg}`);
};
bots['!oops'] = async function(message: { member: { displayName: string; }; channel: { send: (arg0: string) => void; }; }, arg: any) {
    const {user, item, oops} = await dbConnector.getLatestIncident(message.member.displayName);
    if (item) {
        await dbConnector.insertIncident(message.member.displayName, item);
        message.channel.send(`${message.member.displayName} your ${item} tracker is now back to zero`);
    } else {
        message.channel.send(`${message.member.displayName} first start a tracker with !track`);
    }
};
bots['!progress'] = async function(message: { member: { displayName: string; }; channel: { send: (arg0: string) => void; }; }, arg: any) {
    const {user, item, oops} = await dbConnector.getLatestIncident(message.member.displayName);
    if (oops) {
        const oopsDate = new Date(oops);
        const now = new Date();
        const days = Math.floor((now - oopsDate)/(1000 * 60 * 60 * 24));
        message.channel.send(`${message.member.displayName} it has been ${days} days since your last ${item}`);
    } else {
        message.channel.send(`${message.member.displayName} first start a tracker with !track`);
    }
};

bots['!stats'] = async function(message: { member: { displayName: string; }; channel: { send: (arg0: string) => void; }; }, arg: any) {
    const {user, item, oops} = await dbConnector.getLatestIncident(message.member.displayName);
    if (oops) {
        const oopsDate = new Date(oops);
        const now = new Date();
        const hours = Math.floor((now - oopsDate)/(1000 * 60 * 60));
        const rows = await dbConnector.getCurrentIncidents(message.member.displayName, item);
        message.channel.send(`${message.member.displayName} you have called !oops ${rows.length} times since you started your tracker for ${item}.\nIt has been ${hours} hours since your last !oops`);
    } else {
        message.channel.send(`${message.member.displayName} first start a tracker with !track`);
    }
};

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    const {content} = message;
    const [command, arg='soda'] = content.split(' ', 2);
    if (command in bots) {
        await bots[command](message, arg);
    }
});

client.login(token);
