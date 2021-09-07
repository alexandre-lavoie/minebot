import Inventory from "./inventory";
import path from "path";

export default class PlayerInventory extends Inventory {
    constructor() {
        super([47, 137, 227, 317, 412, 500, 588, 678, 770], [425, 515, 605], path.resolve(process.env.DATA_DIR, "./assets/gui/crafting_table.png"));
    }
}