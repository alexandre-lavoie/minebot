import fs from "fs";
import { minecraftIdToName } from "../util";
import { Attachment } from "discord.js";
import path from "path";

export default class Biome {
    minecraft_id: string
    name: string

    constructor(minecraft_id: string, name?: string) {
        this.minecraft_id = minecraft_id;
        this.name = (name) ? name : minecraftIdToName(minecraft_id);
    }

    public static random(): Biome {
        let biome_path = path.resolve(process.env.DATA_DIR, "./assets/biomes");

        const biome_ids = fs.readdirSync(biome_path).map(x => x.split('.')[0]);

        let id = biome_ids[Math.floor(biome_ids.length * Math.random())]
    
        return new Biome(id);
    }

    public getAttachment(): Attachment {
        return new Attachment(path.resolve(process.env.DATA_DIR, `./assets/biomes/${this.minecraft_id}.png`), `${this.minecraft_id}.png`);
    }
}