import { Message } from "discord.js";
import Command from "../component/command";
import Server from "../component/server";
import ItemCommand from "./item";
import { uniformOdd } from "../util";
import fs from "fs";
import path from "path";

export default class FightCommand extends Command {
    public get name(): string {
        return "fight";
    }    
    
    public get description(): string {
        return "Fights current entity.";
    }

    public get active(): boolean {
        return true
    }

    public get usage(): string {
        return "";
    }

    public async execute(message: Message, args: string[]) {
        const FIGHT = JSON.parse(fs.readFileSync(path.resolve(process.env.DATA_DIR, "./data/discord/probability.json")).toString("utf8")).FIGHT;

        if(uniformOdd(FIGHT)){
            let server = Server.fromMessage(message);

            let entity = await server.getEntity();
    
            if(entity){
                let loot = await entity.getLoot();
    
                if(loot){
                    new ItemCommand().execute(message, args, loot);
                }
            }
        }
    }
}