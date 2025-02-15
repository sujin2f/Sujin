import { orbitalKeys } from '@src/constants/ether'
import { Line } from '@src/models/Line'
import { Spectrum } from '@src/models/Spectrum'
import type { ISpectrum, SortType } from '@src/types/ether'

/**
 * Holds the same term based spectra
 */
export class Term {
    /**
     * Stores raw data to create types of line
     */
    private rawItems: Spectrum[][] = []
    /**
     * These are generated from rawItems
     */
    private radial = new Line([])
    private linier = new Line([])
    private lines: Line[] = []
    /**
     * Object information
     */
    private _conf: string[]
    private label: string

    public constructor(spectra: ISpectrum[], type: SortType) {
        this.label = `${spectra[0].term}${spectra[0].j}`
        this._conf = spectra[0].conf
        spectra.forEach((spectrum) => {
            const orbitalNumber = orbitalKeys.indexOf(spectrum.orbital)
            if (!this.rawItems[orbitalNumber]) {
                this.rawItems[orbitalNumber] = []
            }

            const position = spectrum.position - 1
            const item = new Spectrum(spectrum)
            this.rawItems[orbitalNumber][position] = item
        })
        this.radial.label = 'Radial'
        this.linier.label = 'Linier'
        this.setRadial()
        this.setLinier()
        this.sort(type)
    }

    public get conf() {
        return this._conf
    }
    public get energy() {
        return Math.min(...this.lines.map((line) => line.energy))
    }
    public get chartData() {
        const data: Record<string, (string | number)[]> = {}
        this.map((line) => {
            data[`${this.toString()} ${line.toString()}`] = line.value[5]
        })
        return data
    }
    public get maxColumn() {
        return Math.max(
            ...this.rawItems.map((line) => line.length).filter((l) => l),
        )
    }

    public map<T>(callbackfn: (value: Line, index: number) => T) {
        return [this.radial, this.linier, ...this.lines]
            .filter((line) => line && line.length !== 0)
            .map(callbackfn)
    }

    private setRadial() {
        for (let i = 0; i < this.rawItems.length; i++) {
            if (
                this.rawItems[i] &&
                this.rawItems[i].filter((item) => item)[0].orbital === 's'
            ) {
                this.radial.push(...this.rawItems[i])
                return
            }
        }
    }

    private setLinier() {
        this.getDiagonal(this.maxColumn, this.maxColumn + 1).forEach((item) =>
            this.linier.push(item),
        )
    }

    private sortOrbital() {
        this.rawItems
            .filter(
                (items) => items && items.filter((s) => s)[0].orbital !== 's',
            )
            .forEach((line, index) => {
                this.lines[index] = new Line(line, this.linier)
            })
    }

    private sortEther() {
        const lines: Spectrum[][] = []
        for (let line = 1; line <= this.maxColumn - 1; line++) {
            this.getDiagonal(line, this.maxColumn + 1).forEach((item) => {
                if (!lines[line]) {
                    lines[line] = []
                }
                lines[line].push(item)
            })
        }
        lines.reverse().forEach((line, index) => {
            if (!line) {
                return
            }
            this.lines[index] = new Line(line, this.radial)
            this.lines[index].label = `Ether ${index - 1}`
        })
    }

    /**
     * Prepares table data from rawItems
     */
    private sort(type: SortType) {
        if (type === 'ether') {
            this.sortEther()
        } else {
            this.sortOrbital()
        }

        const k = this.linier ? this.linier.k : this.radial.k
        this.lines.forEach((line) => {
            line.k = k
            line.calc()
        })
        this.radial.calc()
        this.linier.calc()
    }

    private getDiagonal(line: number, position: number) {
        let _position = position
        const items: Spectrum[] = []
        for (let i = line; i >= 0; i--) {
            if (this.rawItems[i] && this.rawItems[i][_position - 1]) {
                items[_position - 1] = this.rawItems[i][_position - 1]
            }
            _position--
        }
        return items
    }

    public toString() {
        return this.label
    }
}
