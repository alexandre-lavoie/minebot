import axios from "axios";
import { model, Schema, Document } from "mongoose";
import { InventoryItem } from "./inventory";
import { Message } from "discord.js";
import MinecraftObject from "./minecraftObject";

export interface PlayerModel extends Document {
    discord_id: string
    minecraft_id: string
    inventory: [InventoryItem]
}

export default class Player {
    discord_id: string
    inventory?: [InventoryItem]

    constructor(discord_id: string) {
        this.discord_id = discord_id;
    }

    public getMention(): string {
        return `<@${this.discord_id}>`;
    }

    public static fromMessage(message: Message){
        return new Player(message.author.id);
    }

    public static fromMention(message: Message, index: number) {
        return new Player(message.mentions.users.array()[index].id);
    }

    public static async getMinecraftIDFromName(minecraft_name: string): Promise<string> {
        const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${minecraft_name}`);

        return response.data.id;
    }

    public static async getMinecraftNameFromID(minecraft_id: string): Promise<string> {
        const response = await axios.get(`https://api.mojang.com/user/profiles/${minecraft_id}/names`);
        const names: { name: string }[] = response.data;

        return names[names.length - 1].name;
    }

    public static getMinecraftSkinFromName(minecraft_name: string): string {
        return `https://minotar.net/body/${minecraft_name}/300.png`;
    }

    public async create(minecraft_name: string) {
        playerModel.create({ discord_id: this.discord_id, minecraft_id: await Player.getMinecraftIDFromName(minecraft_name)});
    }

    public async get(): Promise<PlayerModel | null> {
        return await playerModel.findOne({ discord_id: this.discord_id });
    }

    public async getMinecraftSkin() {
        const pl = await this.get();

        if (pl != null) {
            let minecraft_name = await Player.getMinecraftNameFromID(pl.minecraft_id);
    
            return Player.getMinecraftSkinFromName(minecraft_name);
        } else {
            return Player.getMinecraftSkinFromName('Steve');
        }
    }

    public async register(minecraft_name: string): Promise<boolean> {
        if(!minecraft_name) return false;

        let minecraft_id: string = await Player.getMinecraftIDFromName(minecraft_name);

        const players = await playerModel.find({
            "$or": [{
                discord_id: this.discord_id
            }, {
                minecraft_id: minecraft_id
            }]
        });

        if (players.length != 0) return false;
        
        this.create(minecraft_name);
    
        return true;
    }

    async addToInventory(item: MinecraftObject) {
        const hasItem = await playerModel.findOne({ discord_id: this.discord_id, inventory: { '$elemMatch': { minecraft_id: item.minecraft_id } } });
    
        if (hasItem != null) {
            await playerModel.updateOne({ discord_id: this.discord_id, inventory: { '$elemMatch': { minecraft_id: item.minecraft_id } } }, {
                '$inc': {
                    "inventory.$.count": item.count
                }
            });
        } else {
            await playerModel.updateOne({ discord_id: this.discord_id }, {
                '$push': {
                    'inventory': { minecraft_id: item.minecraft_id, count: item.count }
                }
            });
        }
    }
}

export const playerModel = model<PlayerModel>('Player', new Schema({
    discord_id: { type: String, unique: true },
    minecraft_id: { type: String, unique: true },
    inventory: [{ minecraft_id: String, count: Number }]
}));