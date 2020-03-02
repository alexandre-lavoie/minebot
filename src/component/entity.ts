import fs from 'fs';
import { minecraftIdToName } from '../util';
import { Attachment } from 'discord.js';
import * as entities from '../../data/discord/entities.json';
import Item from './item';

interface LootTable {
    type: string,
    pools?: {
        rolls: number | {
            min: number,
            max: number
        },
        entries: {
            type: 'minecraft:item' | 'minecraft:empty' | 'minecraft:loot_table',
            weight?: number,
            functions?: {
                function: string,
                count: {
                    min: number,
                    max: number,
                    type?: string
                }
            }[]
            name: string
        }[]
    }[]
}

export default class Entity {

    minecraft_id: string
    type: string
    name: string

    constructor(minecraft_id: string, type?: string, name?: string) {
        this.minecraft_id = minecraft_id;
        this.type = (type) ? type : minecraft_id;
        this.name = (name) ? name : minecraftIdToName(minecraft_id);
    }

    public static random(): Entity {
        let keys = Object.keys(entities) as Array<keyof typeof entities>;
        let name = keys[Math.floor(keys.length * Math.random())];
        let entity = entities[name];
    
        return new Entity(name, entity.variants[Math.floor(Math.random() * entity.variants.length)]);
    }

    public getAttachment(): Attachment {
        return new Attachment(`./assets/entity/${this.type}.png`, `${this.type}.png`);
    }

    public getLoot(): Item[] | null {
        const loot_table: LootTable = JSON.parse(fs.readFileSync(`./data/loot_tables/entities/${this.minecraft_id}.json`).toString());

        if(loot_table && loot_table.pools) {
            let items: Item[] = []

            for(let pool of loot_table.pools){
                items = [...items, ...pool.entries.filter(entry => entry.type === 'minecraft:item').map(entry => new Item(entry.name.replace('minecraft:', ''), 1))]
            }
            
            return items;
        } else {
            return null;
        }
    }
}