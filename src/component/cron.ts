import Command from "./command";

export default abstract class Cron extends Command {
    abstract get interval(): number;
    public get usage(): string {
        return "";
    }
    public toString(): string {
        return super.toString() + ` (${this.interval} Seconds)`;
    }
}