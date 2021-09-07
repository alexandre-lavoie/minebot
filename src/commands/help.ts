import { RichEmbed, Message } from "discord.js";
import Command from "../component/command";
import { client } from "../index";

export default class HelpCommand extends Command {
    public get name(): string {
        return "help"
    }

    public get description(): string {
        return "Get list of commands."
    }

    public get usage(): string {
        return ""
    }

    public get active(): boolean {
        return true
    }

    public async execute(message: Message, args: string[]) {
        if(client.commands){
            
            let help = "";

            for(let command of client.commands.array()) {
                help += `**!${command.name}${(command.usage === '') ? "" : " " + command.usage}** => ${command.description}\n`
            }

            const embed = new RichEmbed()
                .setColor('#36b030')
                .setTitle(`Commands`)
                .setDescription(help);
    
            message.channel.send(embed);
        }
    }
}
