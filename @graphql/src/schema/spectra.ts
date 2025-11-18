import { COLLECTION } from '@sujin/lib/constants'
import { ISpectrum } from '@sujin/lib/types'
import mongoose from 'mongoose'

const { Schema, model } = mongoose

const spectrumSchema = new Schema<ISpectrum>({
    number: {
        type: Number,
        index: true,
    },
    ion: {
        type: Number,
        index: true,
    },
    energy: Number,
    spin: Number,
    l: String,
    parity: Boolean,
    j: Number,
    base: Number,
    conf: [String],
    eConf: [Number, Number],
    ionReverse: Number,
    position: Number,
    term: String,
    orbital: String,
})
spectrumSchema.index({ number: 1, ion: 1 })

export const Spectra = model('spectra', spectrumSchema, COLLECTION.SPECTRA)
