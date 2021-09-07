import { Attachment } from "discord.js";
import sharp = require('sharp');
import fs from "fs";
import MinecraftObject from "./minecraftObject";
import path from "path";

export default class Block extends MinecraftObject {
    public static random(): Block {
        const blocks = JSON.parse(fs.readFileSync(path.resolve(process.env.DATA_DIR, "./data/discord/blocks.json")).toString("utf8"));

        let keys = Object.keys(blocks) as Array<keyof typeof blocks>;
        let name = keys[Math.floor(keys.length * Math.random())];
        let obj = blocks[name];

        return new Block(obj.id, Math.floor(Math.random() * 10));
    }

    public getImageURL(): string {
        return path.resolve(process.env.DATA_DIR, `./assets/blocks/${this.minecraft_id}.png`);
    }

    public static getImageURLFromID(minecraft_id: string): string {
        return path.resolve(process.env.DATA_DIR, `./assets/blocks/${minecraft_id}.png`);
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
    
    public async getAttachment(): Promise<Attachment> {
        return new Attachment(this.getImageURL(), `${this.minecraft_id}.png`)
    }

    public static isBlock(minecraft_id: string): boolean {
        return fs.existsSync(this.getImageURLFromID(minecraft_id));
    }
}