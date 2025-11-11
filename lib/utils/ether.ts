/* T_Types */
import type { Atom } from '@lib/types/ether'
/* CONSTANTS */
import { periodicTable } from '@lib/constants/ether'

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
