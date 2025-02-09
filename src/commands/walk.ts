import { RichEmbed, Message } from "discord.js";
import Command from "../component/command";
import Biome from "../component/biome";
import Server from "../component/server";
import { uniformOdd } from "../util";
import fs from "fs";
import path from "path";

export default class WalkCommand extends Command {
    public get name(): string {
        return "walk";
    }    
    
    public get description(): string {
        return "Walk to random biome."
    }

    public get active(): boolean {
        return true
    }

    public get usage(): string {
        return ""
    }

    public async execute(message: Message, args: string[]) {
        const BIOME_CHANGE = JSON.parse(fs.readFileSync(path.resolve(process.env.DATA_DIR, "./data/discord/probability.json")).toString("utf8")).BIOME_CHANGE;

        if(uniformOdd(BIOME_CHANGE)){
            let biome = Biome.random();

            const attachment = await biome.getAttachment();
    
            const server = Server.fromMessage(message);

            if(server) await server.updateBiome(biome);
    
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