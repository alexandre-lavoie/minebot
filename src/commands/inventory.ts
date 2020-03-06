import { RichEmbed, Message } from "discord.js";
import Command from '../component/command';
import PlayerInventory from '../component/playerInventory';
import Player from "../component/player";

const playerInventory = new PlayerInventory();

export default class InventoryCommand extends Command {
    public get name(): string {
        return "inventory";
    }    
    
    public get description(): string {
        return "Get page PAGE_ID of your inventory.";
    }

    public get usage(): string {
        return "[PAGE_ID]";
    }

    public get active(): boolean {
        return true
    }

    public async execute(message: Message, args: string[]) {
        const attachment = await playerInventory.getBufferFromPlayer(Player.fromMessage(message), args[0]);

        if(attachment){
            const embed = new RichEmbed()
            .setColor('#36b030')
            .setTitle(`Inventory`)
            .setDescription(`<@${message.author.id}>'s inventory.`)
            .attachFile(attachment)
            .setImage(`attachment://inventory.png`);
    
            message.channel.send(embed);
        }
    }
}