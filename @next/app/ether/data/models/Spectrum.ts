import { ISpectrum } from '@sujin/lib/types'

export class Spectrum {
    spectrum: ISpectrum

    get _id() {
        return this.spectrum._id
    }

    get orbital() {
        return this.spectrum.orbital
    }
    get position() {
        return this.spectrum.position
    }
    get number() {
        return this.spectrum.number
    }
    get ion() {
        return this.spectrum.ion
    }
    get ionReverse() {
        return this.spectrum.ionReverse
    }
    get energy() {
        return this.spectrum.energy
    }
    get conf() {
        return this.spectrum.conf
    }
    get j() {
        return this.spectrum.j
    }
    get term() {
        return this.spectrum.term
    }
    get eConf() {
        return `${this.spectrum.eConf[0]}⭕️${this.spectrum.eConf[1]}➖`
    }

    constructor(spectrum: ISpectrum) {
        this.spectrum = spectrum
    }
}
