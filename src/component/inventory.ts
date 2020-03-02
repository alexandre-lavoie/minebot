import sharp, { OverlayOptions, ResizeOptions } from "sharp";
import { Attachment } from "discord.js";
import Item from "./item";
import Block from "./block";
import Player from "./player";

export interface InventoryItem {
    minecraft_id: string
    count: number
}

export default abstract class Inventory {
    
    columns: number[]
    rows: number[]
    size: number
    image: string

    constructor(columns: number[], rows: number[], image: string) {
        this.columns = columns;
        this.rows = rows;
        this.size = columns.length * rows.length;
        this.image = image;
    }

    public async getBufferFromPlayer(player: Player, shift: number | string): Promise<Attachment | undefined> {
        let pl = await player.get();

        if(pl && pl.inventory){
            return this.getAttachment(pl.inventory, shift);
        }
    }

    public async getAttachment(inventory: [InventoryItem], shift: number | string): Promise<Attachment> {
        if(typeof shift === 'string'){
            shift = parseInt(shift);
        } else if(typeof shift != 'number') {
            shift = 0;
        }

        let buff = await sharp(this.image);

        let items: OverlayOptions[] = [];

        let i = 0;

        for(let item of inventory.slice(this.size * shift, this.size * shift + this.size)){
            items.push({
                input: (Item.isItem(item.minecraft_id)) ? await new Item(item.minecraft_id, item.count).getInventoryImage() : await new Block(item.minecraft_id, item.count).getInventoryImage(),
                left: this.columns[i % this.columns.length],
                top: this.rows[Math.floor(i / this.columns.length)]
            })

            i += 1;
        }

        buff.composite(items);

        buff.resize({ width: 880, kernel: 'nearest' } as ResizeOptions)
        .toBuffer();

        return new Attachment(buff, `inventory.png`);
    }
}