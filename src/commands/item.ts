import { RichEmbed, Message } from "discord.js";
import Command from '../component/command';
import Item from "../component/item";
import Player from "../component/player";
import MinecraftObject from "../component/minecraftObject";

export default class ItemCommand extends Command {
    public get name(): string {
        return "item";
    }    
    
    public get description(): string {
        return "Get a random item";
    }

    public get active(): boolean {
        return false;
    }

    public get usage(): string {
        return "";
    }

    public async execute(message: Message, args: string[], items?: MinecraftObject[]) {
        if(items == null){
            items = [Item.random()];
        } else {
            items = items.filter(i => i.count >= 1);
        }

        for(let item of items){
            await Player.fromMessage(message).addToInventory(item);

            const attachment = await item.getAttachment();

            const embed = new RichEmbed()
            .setColor('#36b030')
            .setTitle(`${item.name}`)
            .setDescription(`<@${message.author.id}> received **${item.count} ${item.name}**.`)
            .attachFile(attachment)
            .setImage(`attachment://${attachment.name}`);
    
            message.channel.send(embed);
        }
    }
}