import { Atom } from '@src/models/Atom'
import type { ISpectrum, SortType } from '@src/types/ether'

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

        Object.entries(rawData).forEach(
            ([key, items]) => (this.atom[key] = new Atom(items, type)),
        )
    }

    public get(number: number, ion: number) {
        return this.atom[`${number}-${ion}`]
    }
}
