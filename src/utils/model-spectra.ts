import { ISpectrum } from '@src/types/ether'
import { getRatio2 } from './ether'

export class Spectrum {
    spectrum?: ISpectrum
    prev?: Spectrum
    parent?: Lines

    // get number() {
    //     return this.spectrum?.number || NaN
    // }
    // get ion() {
    //     return this.spectrum?.ion || NaN
    // }
    // get base() {
    //     return this.spectrum?.base || NaN
    // }
    // get spin() {
    //     return this.spectrum?.spin || NaN
    // }
    // get orbital() {
    //     return this.spectrum?.orbital || 'v'
    // }
    get position() {
        return this.spectrum?.position || NaN
    }
    get energy() {
        return this.spectrum?.energy || 0
    }
    get orbital() {
        return this.spectrum?.conf.join('.') || ''
    }
    get ion() {
        return this.spectrum?.ion || NaN
    }

    constructor(spectrum?: ISpectrum) {
        this.spectrum = spectrum
    }

    get comparison() {
        const rydberg = this.rydberg
        if (isNaN(rydberg) || isNaN(this.diff)) {
            return NaN
        }
        return rydberg / this.diff
    }

    get diff() {
        if (!this.prev) {
            return NaN
        }
        return this.energy - this.prev.energy
    }

    get rydberg() {
        const ratio = this.parent?.ratio
        const k = this.parent?.k
        if (!ratio || !k || !this.prev?.energy) {
            return NaN
        }
        return (
            ratio *
            (1 / Math.pow(this.position - 1 + k, 2) -
                1 / Math.pow(this.position + k, 2))
        )
    }
}

export class Lines {
    points?: [Spectrum, Spectrum]
    // _ratio = [
    //     0, 13.598437763796, 54.41782148808371, 122.45465790936173,
    //     217.7195629020315, 340.2284751688087, 489.99840079323786,
    //     667.055924361162, 871.4268510008975, 1103.1449985216213,
    //     1362.2415828420317,
    // ]
    _ratio = [
        0, 13.597043200000002, 54.414081800000005, 122.44593400000001,
        217.70399976, 340.20278812, 489.9599172, 667.001296, 871.3507608000001,
        1103.04251148, 1362.1086752, 1648.6000336000002, 1962.5342048000002,
        2304.2645441578643, 2673.34624689152, 3070.065431696124,
        3494.4800343532365, 3946.6656857543835, 4426.696802706464,
        4934.640136149553, 5470.592459730612, 6034.647274872255,
        6626.8890523246955, 7247.421888684824, 7896.346420362592,
        8573.78075818725, 9279.836356942295, 10014.639443245876,
        10778.3094901057, 11570.993717338628, 12392.821295986107,
        13243.945955110563, 14124.511254940555, 15034.681679854039,
        15974.624206345828, 16944.501414870014, 17944.509068988147,
        18974.809242322855, 20035.635409681287, 21127.13383282437,
        22249.559602930316, 23403.094518660702, 24587.9680453172,
        25804.440262970213, 27052.72812290715, 28333.118456204204,
        29645.816199329463, 30991.126757017202, 32369.27627283844,
        33780.63396600614, 35225.481435389236, 36704.040372751886,
        38216.703747896594, 39763.8182479069, 41345.72309673692,
        42962.7367975945,
    ]
    _ratio2 = [
        0, 1312, 5250.5, 11815, 21006.6, 32826.7, 47277, 64360, 84078, 106434.3,
        131432, 159076, 189368, 222316, 257923, 296195, 337138, 380760, 427066,
        476063, 527762, 582163, 639294, 699144, 761733, 827067, 895161, 966023,
        1039668, 1116105,
    ]
    shift = []

    get items() {
        return this.spectrums
    }

    constructor(private spectrums: Spectrum[]) {
        spectrums.forEach((item, index) => {
            item.parent = this
            if (spectrums[index - 1]) {
                item.prev = spectrums[index - 1]
            }
            if (!this.points && item.energy !== 0) {
                this.points = [item, spectrums[index + 1]]
            }
        })
    }

    get ratio() {
        if (!this.points) {
            return NaN
        }
        // if (this._ratio[this.points[0].ion]) {
        //     return this._ratio[this.points[0].ion]
        // }
        const shift = this.shift[this.points[0].ion] || 0
        const quartic = getRatio2(
            this.points[0].energy,
            this.points[1].energy,
            shift,
        )
        return Math.max(...quartic) * this.fix
    }

    get k() {
        if (!this.points) {
            return NaN
        }
        if (!this.ratio) {
            return NaN
        }
        const shift = this.shift[this.points[0].ion] || 0
        return (
            Math.sqrt(
                this.ratio / (this.ratio - this.points[0].energy + shift),
            ) - 2
        )
    }

    get fix() {
        if (!this.points) {
            return NaN
        }
        if (this.points[0].ion === 1) {
            return 1
        }

        return -0.000000307 * Math.pow(this.points[0].ion - 1, 2.053) + 0.999931
    }
}
