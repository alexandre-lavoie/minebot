import { minecraftIdToName } from "../util";
import sharp = require("sharp");
import { Attachment } from "discord.js";

export default abstract class MinecraftObject {
    
    name: string
    count: number
    minecraft_id: string

    constructor(minecraft_id: string, count: number = 1, name?: string) {
        this.minecraft_id = minecraft_id;
        this.count = count;
        this.name = (name) ? name : minecraftIdToName(minecraft_id);
    }

    public abstract async getAttachment(): Promise<Attachment>

    public abstract getImageURL(): string

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
}