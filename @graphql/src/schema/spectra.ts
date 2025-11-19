import { COLLECTION } from '@sujin/lib/constants'
import { ISpectrum } from '@sujin/lib/types'
import mongoose from 'mongoose'

const { Schema, model } = mongoose

/**
 * Mongoose schema for spectral data used by the `spectra` collection.
 *
 * The schema matches the `ISpectrum` TypeScript interface and includes
 * indexes on `number` and `ion` for efficient queries.
 */
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

/**
 * Exported model `Spectra` stored under `COLLECTION.SPECTRA`.
 */
export const Spectra = model('spectra', spectrumSchema, COLLECTION.SPECTRA)
