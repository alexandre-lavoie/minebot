import { RichEmbed, Message } from "discord.js";
import Command from '../component/command';
import Player from "../component/player";

export default class SkinCommand extends Command {
    public get name(): string {
        return "skin";
    }    
    
    public get description(): string {
        return "Gets a player skin.";
    }

    public get active(): boolean {
        return true
    }

    public async execute(message: Message, args: string[]) {
        let embed: RichEmbed;

        if(message.mentions.users.size > 0){
            const player = Player.fromMention(message, 0);

            embed = new RichEmbed()
            .setColor('#36b030')
            .setTitle(`Skin`)
            .setDescription(`<@${message.mentions.users.first().id}>'s skin`)
            .setImage(await player.getMinecraftSkin());
        } else {
            embed = new RichEmbed()
            .setColor('#36b030')
            .setTitle(`Skin`)
            .setDescription(`${args[0]}'s skin`)
            .setImage(await Player.getMinecraftSkinFromName(args[0]));
        }

        message.channel.send(embed);
    }
}