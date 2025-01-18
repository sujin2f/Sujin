import { Error } from '@common/model/Error'
// import { peak, ratios } from '@src/constants/spectra'
import { peak, jouleToEv, periodicTable, ratios } from '@src/constants/spectra'
import { Atom } from '@src/types/atom'
// import { RawData, RowType } from '@src/types/spectra'
// import { TermGroup } from '@src/model/ether/TermGroup'
// import {
//     ElectronState,
//     ElectronStateFactory,
// } from '@src/model/ether/ElectronState'
// import { Row } from '@src/model/ether/Row'

import { orbitalKeys } from '@src/constants/spectra'
import { Spectra, OrbitalMatrix } from '@src/types/ether'

export const getRydberg = (ratio: number, k: number, position: number) => {
    return (
        ratio *
        (1 / Math.pow(position + k, 2) - 1 / Math.pow(position + 1 + k, 2))
    )
}

/*
 * Get atom from its number
 */
const getAtom = (number: number): Atom => {
    const atom = periodicTable[number - 1]
    if (atom && atom.number === number) {
        return atom
    }

    for (const element of periodicTable) {
        if (element.number === number) {
            return element
        }
    }
    throw new Error(`Cannot find an atom ${number} from the periodic table.`, {
        code: 'UTL-0003',
        source: 'utils/atom/getAtom',
        level: 'error',
    })
}

const getIonizationEnergy = (number: number, ion: number) => {
    const atom = getAtom(number)

    if (atom.ionization_energies.length < ion) {
        throw new Error(
            `Data does not have any Ionization Energies for atom ${atom.number}, ${atom.symbol}, ion ${ion}`,
            {
                code: 'UTL-0002',
                source: 'utils/atom/getIonizationEnergy',
            },
        )
    }
    return atom.ionization_energies[ion - 1] * jouleToEv
}

const getRatioFromEquation = (ion: number) => {
    return (
        (0.000115 * Math.pow(ion, 5) +
            0.01185 * Math.pow(ion, 4) +
            0.159 * Math.pow(ion, 3) +
            1312.2882 * Math.pow(ion, 2) +
            0.5737 * ion -
            1.032865) *
        jouleToEv
    )
}

const getRatioFromData = (ion: number) => {
    if (ratios[ion - 1]) {
        return ratios[ion - 1]
    }

    const convergence = getIonizationEnergy(ion, ion)
    if (convergence) {
        return convergence
    }

    throw new Error(`Data does not have any ratio for ion: ${ion}`, {
        code: 'UTL-0001',
        source: 'utils/atom/getRatioFromData',
        level: 'info',
    })
}

const getRatio = (ion: number) => {
    try {
        return getRatioFromData(ion)
    } catch {
        return getRatioFromEquation(ion)
    }
}

// export const getEtherTermGroups = (rawData: RawData[]): TermGroup[] => {
//     let baseKey = ''
//     const radialBucket: Record<string, ElectronState[]> = {}
//     const rowsBucket: Record<string, ElectronState[][]> = {}
//     const types: Record<string, RowType[]> = {}

//     rawData.forEach((data) => {
//         const electron = ElectronStateFactory(data)
//         if (electron.isNull) {
//             return
//         }
//         const radial = electron.position - electron.orbital
//         const key = electron.toString('group')

//         if (electron.energy === 0) {
//             baseKey = key
//         }

//         if (!rowsBucket[key]) {
//             rowsBucket[key] = []
//             types[key] = []
//         }
//         if (electron.orbital === 0) {
//             // Radial
//             if (!rowsBucket[key][0]) {
//                 rowsBucket[key][0] = []
//                 types[key][0] = 'radial'
//             }
//             rowsBucket[key][0][electron.position] = electron.clone()
//             // Radial Object
//             if (!radialBucket[key]) {
//                 radialBucket[key] = []
//             }
//             radialBucket[key][electron.position] = electron.clone()
//             if (radial) {
//                 // S base
//                 if (!rowsBucket[key][radial + 1]) {
//                     rowsBucket[key][radial + 1] = []
//                     types[key][radial + 1] = 'ether'
//                 }
//                 rowsBucket[key][radial + 1][electron.position] =
//                     electron.clone()
//             }
//         } else if (radial === 0) {
//             // Linear
//             if (!rowsBucket[key][1]) {
//                 rowsBucket[key][1] = []
//                 types[key][1] = 'linear'
//             }
//             rowsBucket[key][1][electron.position] = electron.clone()
//         } else {
//             // S base
//             if (!rowsBucket[key][radial + 1]) {
//                 rowsBucket[key][radial + 1] = []
//                 types[key][radial + 1] = 'ether'
//             }
//             rowsBucket[key][radial + 1][electron.position] = electron.clone()
//         }
//     })

//     const radials: Record<string, Row> = {}
//     const rows: Record<string, Row[]> = {}

//     Object.keys(radialBucket).forEach((key) => {
//         if (radialBucket[key].length === 0) {
//             return
//         }
//         radialBucket[key].filter((electron) => !!electron)[0].isFirst = true
//         radials[key] = new Row(...radialBucket[key])
//     })
//     Object.keys(rowsBucket).forEach((key) => {
//         rows[key] = rowsBucket[key]
//             .map((electrons, index) => {
//                 electrons.filter((electron) => !!electron)[0].isFirst = true
//                 const row = new Row(...electrons)
//                 row.type = types[key][index]
//                 return row
//             })
//             .filter((row) => row.length !== 0)
//     })

//     return Object.keys(rows).map((key) => {
//         const group = rows[key].map((row) => {
//             const items = row.filter((item) => !!item && !item.isNull)
//             // Fill radial items
//             if (radials[key] && row.type !== 'linear') {
//                 row.push(...radials[key].slice(0, items[0].position))
//             } else if (
//                 radials[baseKey] &&
//                 row.type !== 'linear' &&
//                 !row.isCombination
//             ) {
//                 row.push(...radials[baseKey].slice(0, items[0].position))
//             }
//             row.refresh()
//             return row
//         })
//         return new TermGroup(...group)
//     })
// }

// export const getOrbitalTermGroups = (rawData: RawData[]): TermGroup[] => {
//     const linearBucket: Record<string, ElectronState[]> = {}
//     const rowsBucket: Record<string, ElectronState[][]> = {}

//     rawData.forEach((rawItem) => {
//         const electron = ElectronStateFactory(rawItem)
//         if (electron.isNull) {
//             return
//         }
//         const group = electron.toString('group')

//         if (!rowsBucket[group]) {
//             rowsBucket[group] = []
//         }

//         if (!rowsBucket[group][electron.orbital]) {
//             rowsBucket[group][electron.orbital] = []
//         }

//         if (!linearBucket[group]) {
//             linearBucket[group] = []
//         }

//         rowsBucket[group][electron.orbital][electron.position] = electron

//         // Linear row
//         if (!electron.radial) {
//             const electronLinear = ElectronStateFactory(rawItem)
//             linearBucket[group][electron.position] = electronLinear
//         }
//     })

//     const linear: Record<string, Row> = {}
//     const rows: Record<string, Row[]> = {}

//     // filter and push linear and rows with setting first element
//     Object.keys(linearBucket).forEach((key) => {
//         if (linearBucket[key].length === 0) {
//             return
//         }
//         linearBucket[key].filter((electron) => !!electron)[0].isFirst = true
//         linear[key] = new Row(...linearBucket[key])
//         linear[key].type = 'linear'
//     })

//     Object.keys(rowsBucket).forEach((key) => {
//         rows[key] = rowsBucket[key]
//             .filter((row) => row.length !== 0)
//             .map((electrons) => {
//                 electrons.filter((electron) => !!electron)[0].isFirst = true
//                 return new Row(...electrons)
//             })
//     })

//     // For each rows, set type
//     Object.keys(rows).forEach((key) => {
//         rows[key].forEach((row) => {
//             const items = row.filter((item) => item && !item.isNull)
//             if (items[0].orbital === 0) {
//                 row.type = 'radial'
//             } else {
//                 row.type = 'orbital'
//             }

//             // Fill linear items to empty positions
//             if (linear[key] && row.type === 'orbital') {
//                 row.push(...linear[key].slice(0, items[0].position))
//             }
//             row.refresh()
//         })
//     })

//     // Push Linear to rows
//     Object.keys(linear).forEach((key) => {
//         if (linear[key].length) {
//             rows[key].push(linear[key])
//         }
//     })

//     return Object.keys(rows).map((key) => {
//         return new TermGroup(...rows[key])
//     })
// }

/**
 * Get the peak (p) of equation
 */
export const getPeak = (number: number, ion: number) => {
    const atom = getAtom(number)
    const value = peak[atom.symbol] || []
    if (value[ion - 1]) {
        return value[ion - 1]
    }
    return getIonizationEnergy(number, ion)
}

// /**
//  * Get configuration as an array
//  * 1s2 => [1s, 1s]
//  * 1s2.2s1 => [1s, 1s, 2s]
//  */
// export const getConfArray = (conf: string): string[] => {
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

export const sortSpectra = (
    values: Spectra[],
    number: number,
    ion: number,
): [Record<string, OrbitalMatrix[]>, number, number, number] => {
    const terms: string[] = []
    const matrix: OrbitalMatrix[] = []
    // Minimum of [radial, linear]
    const minimum = [NaN, NaN]
    const minimumPosition = [NaN, NaN]

    values.forEach((spectra) => {
        const term = spectra.term
        const position = spectra.position
        const energy = spectra.energy
        const conf = spectra.conf.slice(0, -1)
        // Radial Minimum
        if (
            (spectra.orbital === 's' && isNaN(minimum[0])) ||
            minimum[0] > energy
        ) {
            minimum[0] = energy
            minimumPosition[0] = position
        }
        // Linear Minimum
        if (
            (spectra.orbital !== 's' && isNaN(minimum[1])) ||
            minimum[1] > energy
        ) {
            minimum[1] = energy
            minimumPosition[1] = position
        }

        const index = `${spectra.j}.${spectra.spin}.${term}.${conf.join('.')}`
        let row = terms.indexOf(index)
        if (row === -1) {
            row = terms.push(index) - 1
            matrix.push({
                term: term,
                j: spectra.j,
                l: spectra.l,
                spin: spectra.spin,
                orbital: spectra.orbital,
                conf,
                items: [],
            })
        }

        delete (spectra as unknown as Record<string, unknown>)._id
        matrix[row].items[position - 1] = spectra
    })

    const group: Record<string, OrbitalMatrix[]> = matrix.reduce(
        (acc, cur) => {
            const base = `${cur.j - orbitalKeys.indexOf(cur.orbital) - cur.spin}-${cur.conf.join('.')}`
            if (!acc[base]) {
                acc[base] = []
            }
            acc[base].push(cur)
            return acc
        },
        {} as Record<string, OrbitalMatrix[]>,
    )

    // Sort by orbital
    Object.entries(group).forEach(([key, value]) => {
        group[key] = value.sort(
            (a, b) =>
                orbitalKeys.indexOf(a.orbital) - orbitalKeys.indexOf(b.orbital),
        )
    })

    // Get K
    const ratio = getRatio(ion)
    const peak = getPeak(number, ion)
    const kRadial =
        Math.sqrt(ratio / (peak - minimum[0])) - minimumPosition[0] - 1
    const kLinear =
        Math.sqrt(ratio / (peak - minimum[1])) - minimumPosition[1] - 1

    return [group, ratio, kRadial, kLinear]
}

export const getEtherConf = (spectra: Spectra) => {
    const o = orbitalKeys.indexOf(spectra.orbital)
    const p = spectra.position
    const r = p - o - 1
    return [r, o]
}
