import Command from "./command";

export default abstract class Cron extends Command {
    abstract get interval(): number;
    public toString(): string {
        return super.toString() + ` (${this.interval} Seconds)`
    }
}