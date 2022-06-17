export const invertArray = <T>(arr: T[]): T[] => {
    const newArray: T[] = [...arr];
    newArray.reverse();
    return newArray;
};
