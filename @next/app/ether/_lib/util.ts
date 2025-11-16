// import { parse } from 'csv-parse'
// /* T_Types */
// import type { ISpectrum } from '@app/ether/data/types'
// import type { Nullable } from '@sujin/share/types'
// /* CONSTANTS */
// import { orbitalKeys } from '@app/ether/data/constants'
// /* Utils */
// import { insertOne } from '@app/ether/_lib/spectra'

// export const insertManyFromCSV = async (
//     number: number,
//     ion: number,
//     csv: string,
// ) => {
//     const columns: Record<string, number> = {
//         'Ei(eV)': 0,
//         conf_i: 0,
//         term_i: 0,
//         J_i: 0,
//         'Ek(eV)': 0,
//         conf_k: 0,
//         term_k: 0,
//         J_k: 0,
//     }
//     let index = false

//     const trimmed = csv
//         .trim()
//         // Remove this ,"="""2,3.sp+"""",
//         .replaceAll(/,"="""([0-9A-Za-z\.,*\[\]]+)(.+?(?="""",))/g, ',')
//     const parser = parse(trimmed, {
//         raw: true,
//         relax_column_count: true,
//     })

//     for await (const record of parser) {
//         if (!index) {
//             Object.keys(columns).forEach((key) => {
//                 columns[key] = record.record.indexOf(key)
//             })
//         } else {
//             // i
//             let rawData = createRawData({
//                 number,
//                 ion,
//                 energy: record.record[columns['Ei(eV)']],
//                 conf: record.record[columns['conf_i']],
//                 j: record.record[columns['J_i']],
//                 term: record.record[columns['term_i']],
//             })

//             if (rawData) {
//                 await insertOne(rawData)
//             }

//             // k
//             rawData = createRawData({
//                 number,
//                 ion,
//                 energy: record.record[columns['Ek(eV)']],
//                 conf: record.record[columns['conf_k']],
//                 j: record.record[columns['J_k']],
//                 term: record.record[columns['term_k']],
//             })

//             if (rawData) {
//                 await insertOne(rawData)
//             }
//         }
//         index = true
//     }
// }

// const filterNumValue = (value: string): number => {
//     const regex = new RegExp(/[0-9.-]+/)
//     const exec = regex.exec(value)

//     if (!exec || !exec.length) {
//         return NaN
//     }

//     return parseFloat(exec[0])
// }

// const filterValue = (value: string): string => {
//     const regex = new RegExp(/[0-9a-zA-Z./*,() <>[\]]+/)
//     const exec = regex.exec(value)

//     if (!exec || !exec.length) {
//         return ''
//     }

//     return exec[0]
// }

// const getNumber = (value: string): number => {
//     const regexInt = /([0-9]+)/.exec(value)
//     const regexFrac = /([0-9]+)\/([0-9]+)/.exec(value)
//     if (regexFrac) {
//         const one = parseInt(regexFrac[1], 10)
//         const two = parseInt(regexFrac[2], 10)
//         return one / two
//     }
//     if (regexInt) {
//         return parseInt(regexInt[1])
//     }
//     return NaN
// }

// const createRawData = (param: {
//     number: number
//     ion: number
//     energy: string
//     conf: string
//     term: string
//     j: string
// }): ISpectrum | void => {
//     const energy = filterNumValue(param.energy)
//     const term = filterValue(param.term)
//     const j = getNumber(param.j)

//     if (!filterValue(param.conf) || !term || isNaN(j) || isNaN(energy)) {
//         return
//     }

//     let l = term
//     let spin: Nullable<number> = parseInt(term.charAt(0))
//     if (isNaN(spin)) {
//         spin = undefined
//     }
//     if (spin) {
//         l = term.slice(1)
//         spin = (spin - 1) / 2
//     }

//     const parity = term.indexOf('*') !== -1
//     if (parity) {
//         l = l.replace('*', '')
//     }

//     const conf = getConfArray(filterValue(param.conf))
//     const positionMatch = /[0-9]+/.exec(conf[conf.length - 1])
//     const orbitalMatch = /[a-z]+/.exec(conf[conf.length - 1]) || ['@']
//     const orbitalIndex = orbitalKeys.indexOf(
//         orbitalMatch[0] as (typeof orbitalKeys)[number],
//     )
//     const orbital = orbitalKeys[orbitalIndex]

//     if (!positionMatch || !orbital) {
//         return
//     }

//     const position = parseInt(positionMatch[0])

//     const oIndex = orbitalKeys.indexOf(orbital)
//     const radial = position - oIndex - 1
//     const eConf = [radial, oIndex]

//     return {
//         ...param,
//         term,
//         ionReverse: param.number - param.ion + 1,
//         energy,
//         spin,
//         l,
//         parity,
//         j,
//         conf,
//         eConf,
//         position,
//         orbital,
//         base: j - orbitalKeys.indexOf(orbital),
//     } as ISpectrum
// }

// /**
//  * Get configuration as an array
//  * 1s2 => [1s, 1s]
//  * 1s2.2s1 => [1s, 1s, 2s]
//  */
// const getConfArray = (conf: string): string[] => {
//     const result: string[] = []
//     const div = conf.indexOf('.') !== -1 ? conf.split('.') : conf.split(' ')
//     div.forEach((el) => {
//         const hasMultiple = /([0-9]+)([a-z]+)([0-9]+)/.exec(el)
//         if (!hasMultiple) {
//             result.push(el)
//             return
//         }
//         Array(parseInt(hasMultiple[3], 10))
//             .fill('')
//             .forEach(() => result.push(`${hasMultiple[1]}${hasMultiple[2]}`))
//     })
//     return result
// }
