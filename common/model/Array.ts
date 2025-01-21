import {
    deepCopy,
    splitItems,
    random,
    trimEnd,
    trimStart,
    filterEmpty,
    sum,
    average,
    shuffle,
    getPrev,
    getNext,
} from '@common/utils/array'

export class Arr<T = number> extends Array {
    constructor(param: number | T[]) {
        super()

        if (typeof param === 'number') {
            this.fill('').map((_, index) => index)
        }

        if (Array.isArray(param)) {
            param.forEach((value, index) => (this[index] = value))
        }
    }

    public deepCopy() {
        return deepCopy(this)
    }

    public splitItems(numOfRows: number) {
        return splitItems(this, numOfRows)
    }

    public random() {
        return random(this)
    }

    public trimEnd() {
        return trimEnd(this)
    }

    public trimStart() {
        return trimStart(this)
    }

    public filterEmpty() {
        return filterEmpty(this)
    }

    public sum() {
        return sum(this)
    }

    public average() {
        return average(this)
    }

    public shuffle() {
        return shuffle(this)
    }

    public getPrev(idx: number) {
        return getPrev(this, idx)
    }

    public getNext(idx: number) {
        return getNext(this, idx)
    }

    public filter(
        predicate: (value: T, index: number, array: T[]) => unknown,
        thisArg?: unknown,
    ): Arr<T> {
        return new Arr(super.filter(predicate, thisArg))
    }

    public map<U>(
        callbackfn: (value: T, index: number, array: T[]) => U,
        thisArg?: unknown,
    ): Arr<U> {
        return new Arr(super.map(callbackfn, thisArg))
    }
}
