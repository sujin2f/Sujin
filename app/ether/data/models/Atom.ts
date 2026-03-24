import { Term } from '@app/ether/data/models/Term'
import type { ISpectrum, SortType, ChartData } from '@common/types'

/**
 * Atom Container that holds organized data for ether page
 */
export class Atom {
    /**
     * Items
     */
    private terms: Record<string, Term> = {}
    /**
     * Atom Information: Electron state should have ground state to determine what its base state is
     */
    private _ground: ISpectrum
    private get ground(): ISpectrum {
        if (!this._ground) {
            // Electron state should have ground state
            throw Error('Cannot find the ground state')
        }
        return this._ground
    }

    /**
     * Gets items array
     */
    private _items: Term[] = []
    private get items() {
        if (this._items.length !== 0) {
            return this._items
        }
        this._items = Object.values(this.terms)
            .filter(
                // Exclude non-ground based state
                (term) => {
                    const conf1 = [...term.conf]
                    const conf2 = [...this.ground?.conf]

                    return conf1.splice(0, -1).join('.') === conf2.splice(0, -1).join('.')
                },
            )
            .sort((a, b) => a.energy - b.energy)
        return this._items
    }
    public map<T>(callbackfn: (value: Term, index: number) => T) {
        return this.items.map(callbackfn)
    }

    public constructor(spectra: ISpectrum[], type: SortType) {
        const rawData: Record<string, ISpectrum[]> = {}
        this._ground = spectra[0]
        spectra.forEach((spectrum) => {
            if (spectrum.energy === 0) {
                this._ground = spectrum
            }

            const conf = spectrum.conf.slice(0, -1).join('.')
            const key = `${spectrum.base}-${spectrum.spin}-${conf}`
            if (!rawData[key]) {
                rawData[key] = []
            }
            rawData[key].push(spectrum)
        })
        Object.entries(rawData).forEach(([key, items]) => (this.terms[key] = new Term(items, type)))
    }

    public get termOptions() {
        return this.map((term) => term.toString()).reduce((acc, cur) => ({ ...acc, [cur]: cur }), {})
    }
    public get chartData() {
        const data: ChartData = {}
        this.map((term) => {
            Object.entries(term.chartData).forEach(([key, value]) => {
                data[`${term.toString()} ${key}`] = value as number[]
            })
        })
        return data
    }
    public get maxColumn() {
        return Math.max(...this.map((term) => term.maxColumn))
    }

    public toString() {
        return `${this.ground.number}-${this.ground.ion}`
    }
}
