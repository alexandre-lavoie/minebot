import { RichEmbed, Message } from "discord.js";
import Command from '../component/command';
import { BIOME_CHANGE } from '../../data/discord/probability.json';
import Biome from "../component/biome";
import Server from "../component/server";
import { uniformOdd } from "../util";

export default class WalkCommand extends Command {
    public get name(): string {
        return "walk";
    }    
    
    public get description(): string {
        return "Random change to walk to next biome."
    }

    public get active(): boolean {
        return true
    }

    public async execute(message: Message, args: string[]) {
        if(uniformOdd(BIOME_CHANGE)){
            let biome = Biome.random();

            const attachment = await biome.getAttachment();
    
            const server = Server.fromMessage(message);

            if(server){
                await server.updateBiome(biome);
            }
    
            const embed = new RichEmbed()
            .setColor('#36b030')
            .setTitle(`${biome.name}`)
            .setDescription(`Welcome to **${biome.name}**.`)
            .attachFile(attachment)
            .setImage(`attachment://${attachment.name}`);
    
            message.channel.send(embed);
        }
    }
    
}