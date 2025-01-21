import { orbitalKeys } from '@src/constants/spectra'

export interface Spectrum {
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
     * see: https://en.wikipedia.org/wiki/Term_symbol
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
     * The electron configuration as array: i.g. [1s, 2s, 2p]
     */
    conf: string[]
    ionReverse: number
    position: number
    term: string
    orbital: (typeof orbitalKeys)[number]
}

export type SpectraItem = {
    [label: string]: Spectrum[]
}

export type Spectra = {
    [termGroup: string]: SpectraItem
}

export type ChartData = { [label: string]: number[] }
export type TableData = {
    [termGroup: string]: { [rowLabel: string]: (string | number)[][] }
}

// export type SortType = 'orbital' | 'ether'

// export type URLParamData = {
//     type: SortType
//     atom: string
//     chartType: keyof typeof TABLE_ROW
// }
// export type URLParamByPosition = {
//     ionReverse: string
//     position: string
//     chartType: keyof typeof TABLE_ROW
// }

// export const TABLE_ROW = {
//     orbital: 'Orbital',
//     ether: 'Ether',
//     energy: 'Energy',
//     diff: 'Diff',
//     transform: 'Transform',
//     between: 'Between',
//     scaled: 'Scaled',
//     k: 'K',
//     ratio: 'Ratio',
//     k2nd: '2nd K',
//     value: 'Value',
//     close: 'close',
//     atom: 'Atom',
//     string: 'String',
// }

// export type RowType = 'radial' | 'linear' | 'ether' | 'orbital'
