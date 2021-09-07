import { Document, model, Schema } from "mongoose";
import Biome from "./biome";
import { Message } from "discord.js";
import Entity from "./entity";

interface ServerModel extends Document {
    discord_id: string
    biome: string
    entity: { 'minecraft_id': string, variant: string }
}

export default class Server {
    discord_id: string

    constructor(discord_id: string){
        this.discord_id = discord_id;
    }

    public async get(): Promise<ServerModel | null> {
        return await serverModel.findOne({ discord_id: this.discord_id });
    }

    public static fromMessage(message: Message): Server {
        return new Server(message.guild.id);
    }

    public async getBiome(): Promise<Biome | undefined> {
        const server = await this.get();

        if(server) {
            if(server.biome) {
                return new Biome(server.biome);
            } else {
                let new_biome = Biome.random();
                this.updateBiome(new_biome);
                return new_biome;
            }
        }
    }

    public async getEntity(): Promise<Entity | undefined> {
        const server = await this.get();

        if(server && server.entity){
            return new Entity(server.entity.minecraft_id);
        }
    }

    public async updateBiome(biome: Biome) {
        await serverModel.updateOne({ discord_id: this.discord_id }, { biome: biome.minecraft_id });
    }

    public async updateEntity(entity: Entity) {
        await serverModel.updateOne({ discord_id: this.discord_id }, { entity: { 'minecraft_id': entity.minecraft_id, variant: entity.type } });
    }

    public async create() {
        await serverModel.create({ discord_id: this.discord_id, biome: Biome.random().minecraft_id })
    }

    public async register(): Promise<boolean> {
        const servers = await serverModel.find({discord_id: this.discord_id});

        if(servers.length == 0){
            await this.create();
    
            return true;
        } else {
            return false;
        }
    }
}

export const serverModel = model<ServerModel>('Server', new Schema({
    discord_id: { type: String, unique: true },
    biome: { type: String, default: null },
    entity: { 'minecraft_id': String, variant: String }
}));