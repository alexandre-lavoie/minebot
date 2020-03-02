import { RichEmbed, Message } from "discord.js";
import Command from '../component/command';
import Server from '../component/server';

export default class BiomeCommand extends Command {

    public get name(): string { 
        return "biome" 
    }

    public get description(): string { 
        return "Get biome" 
    }

    public get active(): boolean {
        return true
    }

    public async execute(message: Message, args: string[]) {
        const server = Server.fromMessage(message);
        
        const biome = await server.getBiome();

        if(biome) {
            const attachment = biome.getAttachment();

            const embed = new RichEmbed()
                .setColor('#36b030')
                .setTitle(`${biome.name}`)
                .setDescription(`Currently in **${biome.name}**.`)
                .attachFile(attachment)
                .setImage(`attachment://${attachment.name}`);
    
            message.channel.send(embed);
        }
    }
}
