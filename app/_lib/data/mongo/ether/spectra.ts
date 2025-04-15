import type { WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* T_Types */
import type { Atom } from '@app/ether/data/types'
import type { ISpectrum } from '@app/ether/data/types'
/* Utils */
import { request as getNistData } from '@app/_lib/data/ether/request'
import { insertManyFromCSV } from '@app/_lib/data/mongo/ether/util'
import { getAtom } from '@app/ether/data/utils'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/types'
import { getCollection } from '@common/data/mongo/mongo'

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
    const spectra = await (
        await getCollection<ISpectrum>(COLLECTION.SPECTRA)
    )
        .find({
            number,
            ion,
        })
        .toArray()
    if (spectra.length) {
        return spectra
    }
    const csv = await getNistData(atom, ion)
    if (!csv) {
        return []
    }
    await insertManyFromCSV(atom.number, ion, csv)
    return await (
        await getCollection<ISpectrum>(COLLECTION.SPECTRA)
    )
        .find({
            number,
            ion,
        })
        .toArray()
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
        async () =>
            await (await getCollection<ISpectrum>(COLLECTION.SPECTRA))
                .find(value)
                .toArray(),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

export const findSpectra = async (spectrum: Partial<ISpectrum>) => {
    const key = `spectra-${JSON.stringify(spectrum)}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () =>
            await (await getCollection<ISpectrum>(COLLECTION.SPECTRA))
                .find(spectrum)
                .toArray(),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

/**
 * Inserts a single spectrum document into the MongoDB collection.
 *
 * @param {ISpectrum} rawData - The spectrum data to insert.
 * @returns {Promise<void>} The result of the insert operation.
 */
export const insertOne = async (rawData: Partial<ISpectrum>): Promise<void> => {
    await getCollection(COLLECTION.SPECTRA).then(async (spectra) => {
        await spectra.findOne({ ...rawData }).then(async (result) => {
            if (!result) {
                await spectra.insertOne(rawData)
            }
        })
    })
}
