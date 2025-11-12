import mongoose from 'mongoose'

const { Schema, model } = mongoose

const spectraSchema = new Schema({
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
spectraSchema.index({ number: 1, ion: 1 })

export const Spectra = model('spectra', spectraSchema)
