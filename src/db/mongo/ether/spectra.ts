import type { Atom } from '@src/types/atom'
import type { ISpectrum } from '@src/types/ether'
import Mongo from '@common/data/mongo/mongo'
import { request as getNistData } from '@src/db/fetch/getNistData'
import { insertManyFromCSV } from '@src/db/mongo/ether/util'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { Cached } from '@common/model/Cached'
import { WithId } from 'mongodb'
import { getAtom } from '@src/utils/ether'
import { isDev } from '@common/utils/system'

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
    const spectra = await Mongo.findMany<ISpectrum>('spectra', {
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
    return await Mongo.findMany<ISpectrum>('spectra', { number, ion })
}

export const getSpectraFromNIST = async (number: number, ion: number) => {
    const atom = getAtom(number)
    const key = `spectra-${number}-${ion}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(atom, ion),
        WEEK_IN_SECONDS,
        isDev,
    )
}

export const getSpectraBySchema = async (schema: string) => {
    const key = `spectra-by-schema-${schema}`
    const value = JSON.parse(decodeURIComponent(schema))
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await Mongo.findMany<ISpectrum>('spectra', value),
        WEEK_IN_SECONDS,
        isDev,
    )
}

export const findSpectra = async (spectrum: Partial<ISpectrum>) => {
    const key = `spectra-${JSON.stringify(spectrum)}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await Mongo.findMany<ISpectrum>('spectra', spectrum),
        WEEK_IN_SECONDS,
        isDev,
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
    await Mongo.findOne('spectra', { ...rawData }).catch(
        async () => await Mongo.insertOne('spectra', rawData),
    )
}
