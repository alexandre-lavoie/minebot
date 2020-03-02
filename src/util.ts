export function minecraftIdToName(id: string): string {
    return id.split("_").map(x => x[0].toUpperCase() + x.substring(1)).join(' ');
}

export function uniformOdd(probability: number | string): boolean {
    if(typeof probability === 'string'){
        return Math.random() <= parseFloat(probability);
    } else {
        return Math.random() <= probability;
    }
}