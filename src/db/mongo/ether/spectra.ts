import type { Filter, WithId } from 'mongodb'
import type { Atom } from '@src/types/atom'
import type { Spectrum } from '@src/types/ether'
import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { request as getNistData } from '@src/db/fetch/getNistData'
import { insertManyFromCSV } from '@src/db/mongo/ether/util'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getAtom } from '@src/utils/ether'

/**
 * Requests spectra data from NIST and save
 *
 * @param {number} doc.number - The atom object.
 * @param {number} doc.ion - The ionization state.
 * @returns {Promise<void>}
 */
const requestNIST = async (
    doc: Filter<Spectrum>,
): Promise<WithId<Spectrum>[]> => {
    const { number, ion } = doc as { number: number; ion: number }
    const atom = getAtom(number)
    const csv = await getNistData(atom, ion)
    if (!csv) {
        return []
    }
    await Mongo.deleteMany('spectra', { number, ion })
    await insertManyFromCSV(atom.number, ion, csv)
    return Mongo.findMany('spectra', { number, ion })
}

/**
 * Requests spectra data
 *
 * @param {Atom} atom - The atom object.
 * @param {number} ion - The ionization state.
 * @returns {Promise<WithId<Spectrum>[]>} The spectra data.
 */
export const request = async (atom: Atom, ion: number) =>
    await getCachedData(
        'spectra',
        { number: atom.number, ion },
        requestNIST,
        WEEK_IN_SECONDS,
    )

/**
 * Inserts a single spectrum document into the MongoDB collection.
 *
 * @param {Partial<Spectrum>} rawData - The spectrum data to insert.
 * @returns {Promise<void>} The result of the insert operation.
 */
export const insertOne = async (rawData: Partial<Spectrum>) => {
    // Prevent duplication
    await Mongo.findOne('spectra', { ...rawData }).catch(
        async () => await Mongo.insertOne('spectra', rawData),
    )
}
