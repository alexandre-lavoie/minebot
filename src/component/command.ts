import { Message } from "discord.js";

export default abstract class Command {
    public abstract get name(): string
    public abstract get usage(): string
    public abstract get description(): string
    public abstract get active(): boolean
    public async execute(message?: Message, args?: string[]): Promise<any> {}
    public toString(): string {
        return this.name + " " + this.usage + " - " + this.description;
    }
}