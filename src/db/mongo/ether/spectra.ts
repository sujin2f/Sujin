import type { WithId } from 'mongodb'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
/* Types */
import type { Atom } from '@src/types/atom'
import type { ISpectrum } from '@src/types/ether'
/* Utils */
import { request as getNistData } from '@src/db/fetch/getNistData'
import { insertManyFromCSV } from '@src/db/mongo/ether/util'
import { getAtom } from '@src/utils/ether'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION } from '@src/constants/mongo'

/**
 * Requests spectra data
 *
 * @param {Atom} atom - The atom object.
 * @param {number} ion - The ionization state.
 * @returns {Promise<WithId<ISpectrum>[]>} The spectra data.
 */
const request = async (
    atom: Atom,
    ion: number,
): Promise<WithId<ISpectrum>[]> => {
    const number = atom.number
    const spectra = await Mongo.findMany<ISpectrum>(COLLECTION.SPECTRA, {
        number,
        ion,
    })
    if (spectra.length) {
        return spectra
    }

    const csv = await getNistData(atom, ion)
    if (!csv) {
        return []
    }
    await insertManyFromCSV(atom.number, ion, csv)
    return await Mongo.findMany<ISpectrum>(COLLECTION.SPECTRA, { number, ion })
}

export const getSpectraFromNIST = async (number: number, ion: number) => {
    const atom = getAtom(number)
    const key = `spectra-${number}-${ion}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(atom, ion),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

export const getSpectraBySchema = async (schema: string) => {
    const key = `spectra-by-schema-${schema}`
    const value = JSON.parse(decodeURIComponent(schema))
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await Mongo.findMany<ISpectrum>(COLLECTION.SPECTRA, value),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

export const findSpectra = async (spectrum: Partial<ISpectrum>) => {
    const key = `spectra-${JSON.stringify(spectrum)}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () =>
            await Mongo.findMany<ISpectrum>(COLLECTION.SPECTRA, spectrum),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

/**
 * Inserts a single spectrum document into the MongoDB collection.
 *
 * @param {Partial<ISpectrum>} rawData - The spectrum data to insert.
 * @returns {Promise<void>} The result of the insert operation.
 */
export const insertOne = async (rawData: Partial<ISpectrum>): Promise<void> => {
    // Prevent duplication
    await Mongo.findOne(COLLECTION.SPECTRA, { ...rawData }).catch(
        async () => await Mongo.insertOne(COLLECTION.SPECTRA, rawData),
    )
}
