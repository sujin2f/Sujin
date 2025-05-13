import type { WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Logger from '@common/model/Logger'
/* T_Types */
import type { Atom } from '@app/ether/data/types'
import type { ISpectrum } from '@app/ether/data/types'
/* Utils */
import { insertManyFromCSV } from '@app/ether/_lib/util'
import { getAtom } from '@app/ether/_lib/client'
import { romanize } from '@common/utils/number'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/types'
import { getCollection } from '@common/data/mongo/mongo'
import sanitize from 'mongo-sanitize'

const requestNIST = async (atom: Atom, ion: number) => {
    Logger.server(`Request NIST -- atom:${atom.number}, ion:${ion}`)

    const ionRoman = romanize(ion)
    const nistUrl = `https://physics.nist.gov/cgi-bin/ASD/lines1.pl?spectra=${atom.symbol}+${ionRoman}&limits_type=0&low_w=&upp_w=&unit=1&de=0&I_scale_type=1&format=2&line_out=0&remove_js=on&en_unit=1&output=0&bibrefs=1&page_size=15&show_obs_wl=1&show_calc_wl=1&unc_out=1&order_out=0&max_low_enrg=&show_av=2&max_upp_enrg=&tsb_value=0&min_str=&A_out=0&intens_out=on&max_str=&allowed_out=1&forbid_out=1&min_accur=&min_intens=&conf_out=on&term_out=on&enrg_out=on&J_out=on&submit=Retrieve+Data`
    return await fetch(nistUrl, {
        method: 'GET',
        cache: 'force-cache',
        next: { revalidate: WEEK_IN_SECONDS },
    }).then((response) => {
        if (response.status >= 400) {
            Logger.server(
                `Failed to request NIST -- atom:${atom.number}, ion:${ion}`,
            )
            return ''
        }
        return response.text()
    })
}

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
    const csv = await requestNIST(atom, ion)
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

export const getSpectraFromNIST = async (_number: number, _ion: number) => {
    const number = sanitize(_number)
    const ion = sanitize(_ion)
    const atom = getAtom(number)
    const key = `spectra-${number}-${ion}`
    return await Cached.getInstance().getOrExecute(key, request(atom, ion), {
        ttl: WEEK_IN_SECONDS,
        force: IS_DEV,
    })
}

export const getSpectraBySchema = async (schema: string) => {
    const key = `spectra-by-schema-${schema}`
    const value = JSON.parse(decodeURIComponent(schema))
    return await Cached.getInstance().getOrExecute(
        key,
        (await getCollection<ISpectrum>(COLLECTION.SPECTRA))
            .find(value)
            .toArray(),
        { ttl: WEEK_IN_SECONDS, force: IS_DEV },
    )
}

/**
 *
 * @param spectrum
 * @returns
 * @deprecated
 */
export const findSpectra = async (spectrum: Partial<ISpectrum>) => {
    const key = `spectra-${JSON.stringify(spectrum)}`
    return await Cached.getInstance().getOrExecute(
        key,
        (await getCollection<ISpectrum>(COLLECTION.SPECTRA))
            .find(spectrum)
            .toArray(),
        { ttl: WEEK_IN_SECONDS, force: IS_DEV },
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
