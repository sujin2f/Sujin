class Array2<T> extends Array<T> {
    public reverse(): Array2<T> {
        return new Array2(...super.reverse())
    }

    public splice(
        start: number,
        deleteCount: number,
        ...items: T[]
    ): Array2<T> {
        return new Array2(...super.splice(start, deleteCount, ...items))
    }

    public map<U>(
        callbackfn: (value: T, index: number, array: T[]) => U,
        thisArg?: any,
    ): Array2<U> {
        return new Array2(...super.map(callbackfn, thisArg))
    }

    public filter(
        predicate: (value: T, index: number, array: T[]) => unknown,
        thisArg?: any,
    ): Array2<T> {
        return new Array2(...super.filter(predicate, thisArg))
    }
}

export { Array2 as Array }
