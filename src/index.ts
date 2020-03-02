import { Client, Collection } from "discord.js";
import dotenv from "dotenv";
import Command from "./component/command";
import fs from 'fs';
import mongoose from 'mongoose';
import Server from './component/server';
import Cron from "./component/cron";

const COMMAND_PREFIX = "!";

dotenv.config();

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_BOT_KEY: string
            DATABASE: string
        }
    }
}

interface ExtendedClient extends Client {
    commands?: Collection<string, Command>
}

export const client: ExtendedClient = new Client();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.on('ready', () => {
    console.log("+---------+");
    console.log("| MineBot |");
    console.log("+---------+");

    console.log("\nCron");
    console.log("---------");
    for(const file of fs.readdirSync('./src/cron/').filter(file => file.endsWith('.ts'))){
        const cronClass = require(`./cron/${file}`).default
        const cron: Cron = new cronClass();

        if(cron.active){
            console.log(`${cron.toString()}`);
            setInterval(cron.execute, cron.interval * 1000);
        }
    }

    client.commands = new Collection();

    console.log("\nCommand");
    console.log("---------");
    for(const file of fs.readdirSync('./src/commands/').filter(file => file.endsWith('.ts'))){
        const commandClass = require(`./commands/${file}`).default;
        const command: Command = new commandClass();

        if(command.active){
            console.log(`${COMMAND_PREFIX}${command.toString()}`)
            client.commands.set(command.name, command);
        }
    }
});

client.on('message', message => {
    if(!message.content.startsWith(COMMAND_PREFIX) || message.author.bot) return;

    const args = message.content.slice(COMMAND_PREFIX.length).split(/ +/);
    let command = args.shift();

    if(command){
        command = command.toLowerCase();
    } else {
        return;
    }

    let commandObject = client.commands?.get(command);

    if(commandObject) {
        commandObject.execute(message, args);
    } else {
        return;
    }
});

client.on('guildCreate', guild => {
    new Server(guild.id).register();
})

client.login(process.env.DISCORD_BOT_KEY);