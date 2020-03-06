import { Message } from "discord.js";
import Command from '../component/command';
import Block from "../component/block";
import ItemCommand from "./item";
import { uniformOdd } from "../util";
import { MINE } from '../../data/discord/probability.json';

export default class MineCommand extends Command {

    public get name(): string {
        return "mine";
    }    
    
    public get description(): string {
        return "Get a random object";
    }

    public get usage(): string {
        return "";
    }

    public get active(): boolean {
        return true
    }

    public async execute(message: Message, args: string[]) {
        if(uniformOdd(MINE)){
            let blocks = [Block.random()];

            await new ItemCommand().execute(message, args, blocks);
        }
    }
}