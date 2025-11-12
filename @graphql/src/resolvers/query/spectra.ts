import { parse } from 'csv-parse'
import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@sujin/node-cache'
import Logger from '@sujin/share/model/Logger'
/* T_Types */
import type { Atom, ISpectrum } from '@sujin/lib/types/ether'
import type { Nullable } from '@sujin/share/types'
/* Utils */
import { getAtom } from '@sujin/lib/utils/ether'
import { romanize } from '@sujin/share/utils/number'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
import { IS_DEV } from '@sujin/share/constants/helper'
import { orbitalKeys } from '@sujin/lib/constants/ether'
import { Spectra } from '@src/schema/spectra'

const requestNIST = async (atom: Atom, ion: number) => {
    Logger.server(`Request NIST -- atom:${atom.number}, ion:${ion}`)

    const ionRoman = romanize(ion)
    const nistUrl = `https://physics.nist.gov/cgi-bin/ASD/lines1.pl?spectra=${atom.symbol}+${ionRoman}&limits_type=0&low_w=&upp_w=&unit=1&de=0&I_scale_type=1&format=2&line_out=0&remove_js=on&en_unit=1&output=0&bibrefs=1&page_size=15&show_obs_wl=1&show_calc_wl=1&unc_out=1&order_out=0&max_low_enrg=&show_av=2&max_upp_enrg=&tsb_value=0&min_str=&A_out=0&intens_out=on&max_str=&allowed_out=1&forbid_out=1&min_accur=&min_intens=&conf_out=on&term_out=on&enrg_out=on&J_out=on&submit=Retrieve+Data`
    return await fetch(nistUrl, {
        method: 'GET',
        cache: 'force-cache',
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

const insertManyFromCSV = async (number: number, ion: number, csv: string) => {
    const columns: Record<string, number> = {
        'Ei(eV)': 0,
        conf_i: 0,
        term_i: 0,
        J_i: 0,
        'Ek(eV)': 0,
        conf_k: 0,
        term_k: 0,
        J_k: 0,
    }
    let index = false

    const trimmed = csv
        .trim()
        // Remove this ,"="""2,3.sp+"""",
        // eslint-disable-next-line no-useless-escape
        .replaceAll(/,"="""([0-9A-Za-z\.,*\[\]]+)(.+?(?="""",))/g, ',')
    const parser = parse(trimmed, {
        raw: true,
        relax_column_count: true,
    })

    for await (const record of parser) {
        if (!index) {
            Object.keys(columns).forEach((key) => {
                columns[key] = record.record.indexOf(key)
            })
        } else {
            // i
            let rawData = createRawData({
                number,
                ion,
                energy: record.record[columns['Ei(eV)']],
                conf: record.record[columns['conf_i']],
                j: record.record[columns['J_i']],
                term: record.record[columns['term_i']],
            })

            if (rawData) {
                await insertOne(rawData)
            }

            // k
            rawData = createRawData({
                number,
                ion,
                energy: record.record[columns['Ek(eV)']],
                conf: record.record[columns['conf_k']],
                j: record.record[columns['J_k']],
                term: record.record[columns['term_k']],
            })

            if (rawData) {
                await insertOne(rawData)
            }
        }
        index = true
    }
}

const filterNumValue = (value: string): number => {
    const regex = new RegExp(/[0-9.-]+/)
    const exec = regex.exec(value)

    if (!exec || !exec.length) {
        return NaN
    }

    return parseFloat(exec[0])
}

const filterValue = (value: string): string => {
    const regex = new RegExp(/[0-9a-zA-Z./*,() <>[\]]+/)
    const exec = regex.exec(value)

    if (!exec || !exec.length) {
        return ''
    }

    return exec[0]
}

const getNumber = (value: string): number => {
    const regexInt = /([0-9]+)/.exec(value)
    const regexFrac = /([0-9]+)\/([0-9]+)/.exec(value)
    if (regexFrac) {
        const one = parseInt(regexFrac[1], 10)
        const two = parseInt(regexFrac[2], 10)
        return one / two
    }
    if (regexInt) {
        return parseInt(regexInt[1])
    }
    return NaN
}

const createRawData = (param: {
    number: number
    ion: number
    energy: string
    conf: string
    term: string
    j: string
}): ISpectrum | void => {
    const energy = filterNumValue(param.energy)
    const term = filterValue(param.term)
    const j = getNumber(param.j)

    if (!filterValue(param.conf) || !term || isNaN(j) || isNaN(energy)) {
        return
    }

    let l = term
    let spin: Nullable<number> = parseInt(term.charAt(0))
    if (isNaN(spin)) {
        spin = undefined
    }
    if (spin) {
        l = term.slice(1)
        spin = (spin - 1) / 2
    }

    const parity = term.indexOf('*') !== -1
    if (parity) {
        l = l.replace('*', '')
    }

    const conf = getConfArray(filterValue(param.conf))
    const positionMatch = /[0-9]+/.exec(conf[conf.length - 1])
    const orbitalMatch = /[a-z]+/.exec(conf[conf.length - 1]) || ['@']
    const orbitalIndex = orbitalKeys.indexOf(
        orbitalMatch[0] as (typeof orbitalKeys)[number],
    )
    const orbital = orbitalKeys[orbitalIndex]

    if (!positionMatch || !orbital) {
        return
    }

    const position = parseInt(positionMatch[0])

    const oIndex = orbitalKeys.indexOf(orbital)
    const radial = position - oIndex - 1
    const eConf = [radial, oIndex]

    return {
        ...param,
        term,
        ionReverse: param.number - param.ion + 1,
        energy,
        spin,
        l,
        parity,
        j,
        conf,
        eConf,
        position,
        orbital,
        base: j - orbitalKeys.indexOf(orbital),
    } as ISpectrum
}

/**
 * Get configuration as an array
 * 1s2 => [1s, 1s]
 * 1s2.2s1 => [1s, 1s, 2s]
 */
const getConfArray = (conf: string): string[] => {
    const result: string[] = []
    const div = conf.indexOf('.') !== -1 ? conf.split('.') : conf.split(' ')
    div.forEach((el) => {
        const hasMultiple = /([0-9]+)([a-z]+)([0-9]+)/.exec(el)
        if (!hasMultiple) {
            result.push(el)
            return
        }
        Array(parseInt(hasMultiple[3], 10))
            .fill('')
            .forEach(() => result.push(`${hasMultiple[1]}${hasMultiple[2]}`))
    })
    return result
}

/**
 * Requests spectra data
 *
 * @param {Atom} atom - The atom object.
 * @param {number} ion - The ionization state.
 * @returns {Promise<ISpectrum[]>} The spectra data.
 */
const request = async (atom: Atom, ion: number): Promise<ISpectrum[]> => {
    const number = atom.number
    return await Spectra.find<ISpectrum>({
        number,
        ion,
    }).then(async (result) => {
        if (result) {
            return result
        }
        const csv = await requestNIST(atom, ion)
        if (!csv) {
            return []
        }
        await insertManyFromCSV(atom.number, ion, csv)
        return await Spectra.find({
            number,
            ion,
        })
    })
}

type Param = {
    number: number
    ion: number
}

export const getSpectraFromNIST = async (
    _: unknown,
    { number: _number, ion: _ion }: Param,
) => {
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
    return await Cached.getInstance().getOrExecute(key, Spectra.find(value), {
        ttl: WEEK_IN_SECONDS,
        force: IS_DEV,
    })
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
        Spectra.find(spectrum),
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
    await Spectra.findOne({ ...rawData }).then(async (result) => {
        if (!result) {
            await Spectra.insertOne(rawData)
        }
    })
}
