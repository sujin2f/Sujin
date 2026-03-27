import { Atom } from '@app/ether/data/models/Atom'
import type { ChartData, ISpectrum, SortType } from '@common/types'

/**
 * Data Container that covers various atom states
 */
export class DataContainer {
    /**
     * Items
     */
    private atom: Record<string, Atom> = {}

    public constructor(spectra: ISpectrum[], type: SortType) {
        const rawData: Record<string, ISpectrum[]> = {}

        // Per each spectrum
        spectra.forEach((item) => {
            const atom = `${item.number}-${item.ion}`

            if (!rawData[atom]) {
                rawData[atom] = []
            }

            rawData[atom].push(item)
        })

        Object.entries(rawData).forEach(([key, items]) => (this.atom[key] = new Atom(items, type)))
    }

    public get(number: number, ion: number) {
        return this.atom[`${number}-${ion}`]
    }

    public map<T>(callbackfn: (value: Atom, index: number) => T) {
        return Object.values(this.atom).map(callbackfn)
    }

    public get chartData() {
        const data: ChartData = {}
        this.map((atom) => {
            Object.entries(atom.chartData).forEach(([key, value]) => {
                data[`${atom.toString()} ${key}`] = value as number[]
            })
        })
        return data
    }
}
