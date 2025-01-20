import { WithId } from 'mongodb'
/* Helpers */
import type { Atom } from '@src/types/atom'
import type {
    Spectrum,
    Spectra,
    ChartData,
    TableData,
    SpectraItem,
} from '@src/types/ether'
import { Error } from '@common/model/Error'
import { peak, jouleToEv, periodicTable, ratios } from '@src/constants/spectra'
import { orbitalKeys } from '@src/constants/spectra'
import { map, trimEnd, trimStart } from '@common/utils/array'
import { Nullable } from '@common/types'

/**
 * Calculates the Rydberg formula for a given ratio, k, and position.
 *
 * @param {number} ratio - The ratio value.
 * @param {number} k - The k, horizontal shifting value.
 * @param {number} position - The position of spectra.
 * @returns {number} The calculated Rydberg value.
 */
export const getRydberg = (
    ratio: number,
    k: number,
    position: number,
): number => {
    return (
        ratio *
        (1 / Math.pow(position + k, 2) - 1 / Math.pow(position + 1 + k, 2))
    )
}

/**
 * Retrieves an atom from the periodic table by its atomic number.
 *
 * @param {number} number - The atomic number of the atom.
 * @returns {Atom} The atom object.
 * @throws {Error} If the atom cannot be found in the periodic table.
 */
export const getAtom = (number: number): Atom => {
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

/**
 * Retrieves the ionization energy for a given atom and ionization state.
 *
 * @param {number} number - The atomic number of the atom.
 * @param {number} ion - The ionization state.
 * @returns {number} The ionization energy.
 * @throws {Error} If the ionization energy data is not available for the given atom and ionization state.
 */
const getIonizationEnergy = (number: number, ion: number): number => {
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

/**
 * Calculates the ratio with a equation.
 *
 * @param {number} ion - The ionization state.
 * @returns {number} The calculated ratio.
 */
const calculatesRatio = (ion: number): number => {
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

/**
 * Gets the ratio from given data points.
 *
 * @param {number} ion - The ionization state.
 * @returns {number} The calculated ratio.
 * @throws {Error} If the ionization energy data is not available for the ratio.
 */
const getRatioFromData = (ion: number): number => {
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

/**
 * Retrieves the ratio for an ionization state.
 *
 * @param {number} ion - The ionization state.
 * @returns {number} The ratio.
 */
const getRatio = (ion: number): number => {
    try {
        return getRatioFromData(ion)
    } catch {
        return calculatesRatio(ion)
    }
}

/**
 * Retrieves the peak value for a given atom and ionization state.
 *
 * @param {number} number - The atomic number of the atom.
 * @param {number} ion - The ionization state.
 * @returns {number} The peak value.
 */
export const getPeak = (number: number, ion: number): number => {
    const atom = getAtom(number)
    const value = peak[atom.symbol] || []
    if (value[ion - 1]) {
        return value[ion - 1]
    }
    return getIonizationEnergy(number, ion)
}

/**
 * Sorts the spectrum data.
 *
 * @param {Spectrum[]} spectra - The spectrum data from DB.
 * @param {number} number - The atomic number of the atom.
 * @param {number} ion - The ionization state.
 * @returns {[Spectra, number, number, number]} The sorted spectrum data, ratio, radial k, and linear k.
 */
export const getSpectra = (
    spectra: WithId<Spectrum>[],
    number: number,
    ion: number,
): [Spectra, number, number, number] => {
    let result: Spectra = {}
    // Minimum of [radial, linear]
    const minimum = [NaN, NaN]
    const minimumPosition = [NaN, NaN]

    // Per each spectrum
    spectra.forEach((spectrum) => {
        const { position, energy, j, orbital, spin } = spectrum
        const conf = spectrum.conf.slice(0, -1)
        // Radial Minimum
        if (
            (spectrum.orbital === 's' && isNaN(minimum[0])) ||
            minimum[0] > energy
        ) {
            minimum[0] = energy
            minimumPosition[0] = position
        }
        // Linear Minimum
        if (
            (spectrum.orbital !== 's' && isNaN(minimum[1])) ||
            minimum[1] > energy
        ) {
            minimum[1] = energy
            minimumPosition[1] = position
        }

        const termGroupKey = `${j - orbitalKeys.indexOf(orbital)}_${spin}_${conf.join('.')}`

        if (!result[termGroupKey]) {
            result[termGroupKey] = {}
        }
        if (!result[termGroupKey][orbital]) {
            result[termGroupKey][orbital] = []
        }

        // Remove ID from Mongo result
        delete (spectrum as unknown as Record<string, unknown>)._id
        result[termGroupKey][orbital][position - 1] = spectrum as Spectrum
    })

    // Get K
    const ratio = getRatio(ion)
    const peak = getPeak(number, ion)
    const kRadial =
        Math.sqrt(ratio / (peak - minimum[0])) - minimumPosition[0] - 1
    const kLinear =
        Math.sqrt(ratio / (peak - minimum[1])) - minimumPosition[1] - 1
    const orbitals = orbitalKeys as unknown as string[]

    result = Object.entries(result)
        // Sort term group by minimum energy
        .sort(([, a], [, b]) => {
            const min1 = Math.min(
                ...Object.values(a).map((value) => trimStart(value)[0].energy),
            )
            const min2 = Math.min(
                ...Object.values(b).map((value) => trimStart(value)[0].energy),
            )
            return min1 - min2
        })
        .reduce((acc, [, group], index) => {
            // Sort items in term group
            const sorted = Object.entries(group)
                .sort(
                    ([aKey], [bKey]) =>
                        orbitals.indexOf(aKey) - orbitals.indexOf(bKey),
                )
                .reduce((acc, [, value]) => {
                    // Row Label
                    const label = trimStart(value)[0].term
                    return { ...acc, [label]: value }
                }, {} as SpectraItem)

            const spectra = sorted[Object.keys(sorted)[0]]
            const spectrum = spectra[spectra.length - 1]
            // Term Label
            const label = `${spectrum.term}_${spectrum.j}_${index}`
            return {
                ...acc,
                [label]: sorted,
            }
        }, {} as Spectra)

    return [result, ratio, kRadial, kLinear]
}

/**
 * Sorts the ether data.
 *
 * @param {Spectra} group - The grouped spectrum data.
 * @returns {Spectra} The sorted ether data.
 */
export const sortEther = (spectra: Spectra): Spectra => {
    return Object.entries(spectra).reduce((acc, [groupKey, term]) => {
        const radial: Spectrum[] = []
        const linear: Spectrum[] = []
        const ether: Spectrum[][] = []

        Object.values(term).forEach((items: Spectrum[]) =>
            items.forEach((spectrum: Spectrum) => {
                if (!spectrum) {
                    return
                }
                const orbital = orbitalKeys.indexOf(spectrum.orbital)
                const etherRow = spectrum.position - orbital - 2
                if (etherRow >= 0 && !ether[etherRow]) {
                    ether[etherRow] = []
                }
                if (etherRow >= 0) {
                    ether[etherRow][spectrum.position] = spectrum
                }
                // Radial
                if (orbital === 0) {
                    radial[spectrum.position] = spectrum
                }
                // Linear
                if (etherRow === -1) {
                    linear[spectrum.position] = spectrum
                }
            }),
        )

        const result: SpectraItem = {}
        if (radial.length) {
            result.Radial = radial
        }
        if (linear.length) {
            result.Linear = linear
        }

        return {
            ...acc,
            [groupKey]: {
                ...result,
                ...ether.reduce(
                    (acc, cur, index) => ({ ...acc, [`Ether_${index}`]: cur }),
                    {},
                ),
            },
        }
    }, {} as Spectra)
}

/**
 * Retrieves the ether configuration for a given atom and ionization state.
 *
 * @param {Spectrum} spectra - Spectra data.
 * @returns {[number, number]} Num of radial & liner.
 */
export const getEtherConf = (spectrum: Spectrum): [number, number] => {
    const o = orbitalKeys.indexOf(spectrum.orbital)
    const p = spectrum.position
    const r = p - o - 1
    return [r, o]
}

/**
 * Returns the client data to make a chart and a table.
 *
 * @param {Spectrum} spectra - Spectra data.
 * @param {number} ratio - The ratio.
 * @param {number} kRadial - k value of radial.
 * @param {number} kLinear - k value of linear.
 * @returns {[ChartData, TableData, string[], number]} client data -- chart, table, table labels, and max column.
 */
export const getClientData = (
    spectra: Spectra,
    ratio: number,
    kRadial: number,
    kLinear: number,
): [ChartData, TableData, string[], number] => {
    const maxColumn = Math.max(
        ...Object.values(spectra)
            .map((group) => Object.values(group).map((items) => items.length))
            .flat(),
    )
    const chartData: ChartData = {}
    const tableData: TableData = Object.entries(spectra).reduce(
        (acc, [termGroup, term]) => {
            const result: { [rowLabel: string]: (string | number)[][] } = {}

            Object.entries(term).forEach(([rowLabel, row]) => {
                const rowResult: (string | number)[][] = [
                    map(maxColumn, () => ''),
                    map(maxColumn, () => ''),
                    map(maxColumn, () => ''),
                    map(maxColumn, () => ''),
                    map(maxColumn, () => ''),
                ]

                let prev: Nullable<Spectrum> = undefined
                row.forEach((spectrum) => {
                    const e1 = spectrum ? spectrum.energy : NaN
                    const e2 = prev ? prev.energy : NaN
                    const diff = !isNaN(e1) && !isNaN(e2) ? e1 - e2 + 3000 : ''
                    const rydberg =
                        spectrum.orbital === 's'
                            ? getRydberg(ratio, kRadial, spectrum.position)
                            : getRydberg(ratio, kLinear, spectrum.position)

                    // conf
                    rowResult[0][spectrum.position - 1] =
                        spectrum && spectrum.conf.join('.')
                    // eConf
                    rowResult[1][spectrum.position - 1] =
                        spectrum && getEtherConf(spectrum).toString()
                    // energy
                    rowResult[2][spectrum.position - 1] =
                        spectrum && spectrum.energy.toFixed(8)
                    // diff
                    rowResult[3][spectrum.position - 1] =
                        diff && (diff - 3000).toFixed(8)
                    // rydberg
                    rowResult[4][spectrum.position - 1] = diff
                        ? ((diff - 3000) / rydberg).toFixed(8)
                        : ''
                    prev = spectrum
                })
                result[rowLabel] = rowResult
                chartData[`${termGroup}.${rowLabel}`] = trimEnd(
                    rowResult[4].map((value) => value || NaN),
                ) as number[]
            })
            return {
                ...acc,
                [termGroup]: result,
            }
        },
        {},
    )
    const rowHead = ['conf', 'eConf', 'energy', 'diff', 'rydberg']
    return [chartData, tableData, rowHead, maxColumn]
}

// import { peak, ratios } from '@src/constants/spectra'
// import { RawData, RowType } from '@src/types/spectra'
// import { TermGroup } from '@src/model/ether/TermGroup'
// import {
//     ElectronState,
//     ElectronStateFactory,
// } from '@src/model/ether/ElectronState'
// import { Row } from '@src/model/ether/Row'

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
