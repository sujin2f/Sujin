import { orbitalKeys } from '@lib/constants/ether'

export interface ISpectrum {
    /**
     * Atom number
     */
    number: number
    /**
     * Ion number
     */
    ion: number
    /**
     * eV
     */
    energy: number
    /**
     * Spin quantum number
     * @see: https://en.wikipedia.org/wiki/Term_symbol
     */
    spin: number
    /**
     * The orbital angular momentum quantum number
     */
    l: string
    /**
     * Term symbol parity
     */
    parity: boolean
    /**
     * The total electronic angular momentum quantum number
     * 0, 1, 2, ... n-1
     * @see http://hyperphysics.phy-astr.gsu.edu/hbase/quantum/qangm.html#c2
     */
    j: number
    /**
     * The key of being same base state
     * It is j - position of term
     * i.g. j=1.5 orbital=p => base = 0.5
     */
    base: number
    /**
     * The electron configuration as array: i.g. [1s, 2s, 2p]
     */
    conf: string[]
    /**
     * Number of radial and linier ethers
     */
    eConf: [number, number]
    ionReverse: number
    position: number
    term: string
    orbital: (typeof orbitalKeys)[number]
}

export type SpectraItem = {
    [label: string]: ISpectrum[]
}

export type Spectra = {
    [termGroup: string]: SpectraItem
}

export type ChartData = { [label: string]: number[] }
export type TableData = {
    [termGroup: string]: { [rowLabel: string]: (string | number)[][] }
}

export type SortType = 'orbital' | 'ether'

export type Atom = {
    number: number
    name: string
    symbol: string
    atomic_mass: number
    density: number | null
    period: number
    xpos: number
    ypos: number
    shells: number[]
    electron_configuration: string
    ionization_energies: number[]
} & Record<string, unknown>
