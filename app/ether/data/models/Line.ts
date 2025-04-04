import { default as quartic } from 'quartic'

import { Spectrum } from '@app/ether/data/models/Spectrum'
import { getAtom } from '@app/helpers/utils/ether'
import { jouleToEv, ROW_HEAD } from '@app/helpers/constants/ether'

export class Line {
    private spectra: Spectrum[] = []
    private orbitals = new Set<string>()
    private first: Spectrum
    private _shift = NaN
    private _ratio = NaN
    private _k = NaN
    private _fix = NaN
    private _rydberg: number[] = []
    private _comparison: number[] = []
    private _value: (string | number)[][] = []
    public label = ''

    public constructor(spectra: Spectrum[], composition?: Line) {
        this.first = spectra[0]
        spectra.forEach((spectrum) => {
            if (!spectrum) {
                return
            }
            if (!this.first || this.first.position > spectrum.position) {
                this.first = spectrum
            }
            const position = spectrum.position - 1
            this.spectra[position] = spectrum
            this.orbitals.add(spectrum.orbital)
        })

        if (composition) {
            const gap = composition.items.slice(0, this.first.position - 1)
            this.push(...gap)
        }
    }

    public push(...spectra: Spectrum[]) {
        const pushFirst = !this.first
        spectra
            .filter((item) => item)
            .forEach((spectrum) => {
                if (pushFirst) {
                    if (
                        !this.first ||
                        this.first.position > spectrum.position
                    ) {
                        this.first = spectrum
                    }
                }
                const position = spectrum.position - 1
                this.spectra[position] = spectrum
            })
    }

    get energy() {
        return this.first.energy
    }

    get length() {
        return this.spectra.length
    }

    get items(): Spectrum[] {
        return this.spectra
    }

    private get conf(): string[] {
        return this.spectra.map((item) => item.conf.join('.'))
    }

    private get eConf(): string[] {
        return this.spectra.map((item) => item.eConf)
    }

    private get energies(): number[] {
        return this.spectra.map((item) => item.energy)
    }

    private get diffs(): number[] {
        return this.spectra.map((item, index) => {
            const prev = this.spectra[index - 1]
            if (!prev) {
                return NaN
            }
            return item.energy - prev.energy
        })
    }

    private get shift(): number {
        if (this.first.ionReverse === 1) {
            return 0
        }
        if (!isNaN(this._shift)) {
            return this._shift
        }
        const atom = getAtom(this.first.number)
        this._shift =
            atom.ionization_energies[this.first.ion - 1] * jouleToEv -
            this.ratio
        return this._shift
    }

    private get ratio() {
        if (!isNaN(this._ratio) || !this.first) {
            return this._ratio
        }

        this._ratio = this.ratioFromPoints
        return this._ratio

        const atom = getAtom(this.first.ion)
        const peak = atom.ionization_energies[this.first.ion - 1]
        if (!peak) {
            this._ratio = this.ratioFromPoints
            return this._ratio
        }
        this._ratio = peak * jouleToEv
        return this._ratio
    }

    private get ratioFromPoints() {
        const first =
            this.first.energy === 0
                ? this.spectra[this.first.position]
                : this.first
        if (!first) {
            return NaN
        }
        const second = this.spectra[first.position]
        if (!second) {
            return NaN
        }

        const a = first.energy
        const b = second.energy
        const sqa = Math.pow(a, 2)
        const sqb = Math.pow(b, 2)
        const coefficients = [3, -4 * (a + b), 6 * a * b, 0, -1 * sqa * sqb]
        const result = quartic(coefficients)
            .filter((value) => !value.im && value.re > 0)
            .map((value) => value.re)

        return Math.max(...result) * this.fix
    }

    set k(k: number) {
        this._k = k
    }
    get k() {
        if (!isNaN(this._k)) {
            return this._k
        }

        if (isNaN(this.ratio)) {
            return NaN
        }
        const first =
            this.first.energy === 0
                ? this.spectra[this.first.position]
                : this.first

        if (!first) {
            return NaN
        }

        this._k =
            Math.sqrt(this.ratio / (this.ratio - first.energy + this.shift)) -
            first.position
        return this._k
    }

    get fix() {
        if (!isNaN(this._fix)) {
            return this._fix
        }
        if (this.first.ion === 1) {
            return 1
        }

        this._fix =
            -0.000000307 * Math.pow(this.first.ion - 1, 2.053) + 0.999931
        return this._fix
    }

    private getRydberg() {
        if (this._rydberg.length !== 0) {
            return this._rydberg
        }

        const ratio = this.ratio
        if (isNaN(ratio) || isNaN(this.k)) {
            this._rydberg = [NaN]
            return this._rydberg
        }
        this._rydberg = this.spectra.map((item, index) => {
            const prev = this.spectra[index - 1]
            if (!prev || prev.energy === 0) {
                return NaN
            }
            return (
                ratio *
                (1 / Math.pow(item.position - 1 + this.k, 2) -
                    1 / Math.pow(item.position + this.k, 2))
            )
        })
        return this._rydberg
    }

    private getComparison(indexDiff: number, indexRydberg: number) {
        if (this._comparison.length !== 0) {
            return this._comparison
        }

        const diffs = this._value[indexDiff] as number[]
        const rydberg = this._value[indexRydberg] as number[]
        this._comparison = diffs.map((diff, index) => {
            if (!isNaN(diff) && !isNaN(rydberg[index])) {
                return diff / rydberg[index]
            }

            return NaN
        })
        return this._comparison
    }

    public calc() {
        ROW_HEAD.forEach((row, index) => {
            switch (row) {
                case 'Conf':
                    this._value[index] = this.conf
                    break
                case 'eConf':
                    this._value[index] = this.eConf
                    break
                case 'Energy':
                    this._value[index] = this.energies
                    break
                case 'Diff':
                    this._value[index] = this.diffs
                    break
                case 'Rydberg':
                    this._value[index] = this.getRydberg()
                    break
                case 'Comparison':
                    this._value[index] = this.getComparison(
                        ROW_HEAD.indexOf('Diff'),
                        ROW_HEAD.indexOf('Rydberg'),
                    )
                    break
            }
        })

        this.toString()
    }

    public get value() {
        return this._value
    }

    public toString() {
        if (this.label) {
            return this.label
        }
        const orbitals = this.orbitals.values().toArray()
        if (orbitals.length === 1) {
            this.label = `${orbitals[0].toUpperCase()} Orbital`
            return this.label
        }
        this.label = 'Mixed'
        return this.label
    }
}
