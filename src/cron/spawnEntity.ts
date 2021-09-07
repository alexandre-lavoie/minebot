import Cron from "../component/cron";
import { client } from "../index";
import { TextChannel, RichEmbed } from "discord.js";
import Entity from "../component/entity";
import Server from "../component/server";

export default class SpawnEntityCron extends Cron {
    public get interval(): number {
        return 60;
    }    
    
    public get name(): string {
        return "Spawn Entity";
    }

    public get description(): string {
        return "Spawns an entity periodically.";
    }

    public get active(): boolean {
        return true
    }

    public async execute() {
        client.guilds.forEach(guild => {
            guild.channels
            .filter(channel => channel.name === 'spawn' && channel.type === 'text' && channel.parent != null && channel.parent.name.toLowerCase() === 'minebot')
            .forEach(async channel => {
                const entity = Entity.random();

                const server = new Server(guild.id);

                await server.updateEntity(entity);

                const attachment = entity.getAttachment();

                const embed = new RichEmbed()
                .setColor('#36b030')
                .setTitle(`${entity.name}`)
                .setDescription(`A wild **${entity.name}** appeared.`)
                .attachFile(attachment)
                .setImage(`attachment://${attachment.name}`);

                (channel as TextChannel).send(embed);
            })
        })
    }
}