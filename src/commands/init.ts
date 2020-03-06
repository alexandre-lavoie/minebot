import { RichEmbed, Message } from "discord.js";
import Command from '../component/command';
import Player from "../component/player";

export default class InitCommand extends Command {
    public get name(): string {
        return "init";
    }    
    
    public get description(): string {
        return "Add player of MineBot database.";
    }

    public get usage(): string {
        return "[MINECRAFT_USERNAME]"
    }

    public get active(): boolean {
        return true
    }

    public async execute(message: Message, args: string[]) {
        const player = Player.fromMessage(message);

        const canRegister = await player.register(args[0]);

        let embed = new RichEmbed();

        if(canRegister){
            embed = new RichEmbed()
            .setColor('#36b030')
            .setTitle(`Welcome ${args[0]}`)
            .setDescription(`<@${message.author.id}> joined the game.`)
            .setImage(Player.getMinecraftSkinFromName(args[0]));
        } else {
            const playerModel = await player.get();

            if(playerModel) {
                embed = new RichEmbed()
                .setColor('#36b030')
                .setTitle(`Welcome Back`)
                .setDescription(`<@${message.author.id}> is already in game.`)
                .setImage(await player.getMinecraftSkin());
            }
        }

        message.channel.send(embed);
    }
}