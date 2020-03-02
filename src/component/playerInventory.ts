import Inventory from './inventory';

export default class PlayerInventory extends Inventory {

    constructor() {
        super([47, 137, 227, 317, 412, 500, 588, 678, 770], [425, 515, 605], `./assets/gui/inventory.png`);
    }

}