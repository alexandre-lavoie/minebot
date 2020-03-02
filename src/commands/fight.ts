import { Message } from "discord.js";
import Command from '../component/command';
import Server from "../component/server";
import ItemCommand from "./item";
import { uniformOdd } from "../util";
import { FIGHT } from '../../data/discord/probability.json';

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

    public async execute(message: Message, args: string[]) {
        if(uniformOdd(FIGHT)){
            let server = await Server.fromMessage(message);

            let entity = await server.getEntity();
    
            if(entity){
                let loot = entity.getLoot();
    
                if(loot){
                    new ItemCommand().execute(message, args, loot);
                }
            }
        }

    }
}