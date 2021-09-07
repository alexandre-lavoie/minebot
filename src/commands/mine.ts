import { Message } from "discord.js";
import Command from "../component/command";
import Block from "../component/block";
import ItemCommand from "./item";
import { uniformOdd } from "../util";
import fs from "fs";
import path from "path";

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
        const MINE = JSON.parse(fs.readFileSync(path.resolve(process.env.DATA_DIR, "./data/discord/probability.json")).toString("utf8")).MINE;

        if(uniformOdd(MINE)){
            let blocks = [Block.random()];

            await new ItemCommand().execute(message, args, blocks);
        }
    }
}