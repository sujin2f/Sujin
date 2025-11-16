/* T_Types */
import type { Atom } from '../types/ether'
/* CONSTANTS */
import { periodicTable } from '../constants/ether'

/**
 * Calculates the Rydberg formula for a given ratio, k, and position.
 *
 * @param {number} ratio - The ratio value.
 * @param {number} k - The k, horizontal shifting value.
 * @param {number} position - The position of spectra.
 * @returns {number} The calculated Rydberg value.
 * @deprecated
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
    throw Error(`Cannot find an atom ${number} from the periodic table.`)
}
