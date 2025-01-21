import { Spectrum } from '@src/types/ether'
import Mongo from '@src/db/mongo/connect'

const insertOne = async (rawData: Partial<Spectrum>) => {
    const data = await findOne(rawData)
    if (!data) {
        await Mongo.insertOne('spectra', rawData)
    }
}

const findMany = async (number: number, ion: number) =>
    await Mongo.findMany<Spectrum>('spectra', { number, ion })

const findOne = async (rawData: Partial<Spectrum>) =>
    await Mongo.findOne('spectra', { ...rawData })

const actions = {
    findMany,
    insertOne,
    findOne,
}

export default actions
