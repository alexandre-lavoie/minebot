import { Attachment } from "discord.js";
import sharp, {ResizeOptions} from "sharp";
import fs from "fs";
import MinecraftObject from "./minecraftObject";
import path from "path";

export default class Item extends MinecraftObject {
    public static random(): Item {
        const items = JSON.parse(fs.readFileSync(path.resolve(process.env.DATA_DIR, "./data/discord/items.json")).toString("utf8"));

        let keys = Object.keys(items) as Array<keyof typeof items>;
        let name = keys[Math.floor(keys.length * Math.random())];
        let obj = items[name];
    
        return new Item(obj.id, Math.floor(Math.random() * 10));
    }

    public getImageURL(): string {
        return path.resolve(process.env.DATA_DIR, `./assets/items/${this.minecraft_id}.png`);
    }

    public static getImageURLFromID(minecraft_id: string): string {
        return path.resolve(process.env.DATA_DIR, `./assets/items/${minecraft_id}.png`);
    }

    public async getAttachment(): Promise<Attachment> {
        let buff = await sharp(this.getImageURL())
        .resize({width: 300, kernel: 'nearest'} as ResizeOptions)
        .toBuffer();
    
        return new Attachment(buff, `${this.minecraft_id}.png`);
    }

    public async getInventoryImage(): Promise<Buffer> {
        return await sharp(this.getImageURL())
        .resize({ width: 64, height: 64, kernel: 'nearest' })
        .composite([{
            input: Buffer.from(`<svg height="20" width="20"><text x="0" y="20" font-size="20px" style="font-weight:bold;" fill="white">${this.count}</text></svg>`),
            left: 50,
            top: 50
        }])
        .toBuffer();
    }

    public static isItem(minecraft_id: string): boolean {
        return fs.existsSync(this.getImageURLFromID(minecraft_id));
    }
}