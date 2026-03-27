import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISpectrum } from '@common/types'

type State = {
    spectrum: { [atom: number]: { [ion: number]: ISpectrum[] } }
    size: number
}

const initialState: State = {
    spectrum: {},
    size: 0,
}

const MAX_SIZE = 1000

export const spectrumSlice = createSlice({
    name: 'spectrum',
    initialState,
    reducers: {
        pushSpectrum: (state, action: PayloadAction<[number, number, ISpectrum[]]>) => {
            const [atom, ion, spectrum] = action.payload
            const newSize = state.size + spectrum.length
            if (newSize > MAX_SIZE) {
                state.size = spectrum.length
                state.spectrum = {}
            } else {
                state.size = newSize
            }

            state.spectrum = {
                ...state.spectrum,
                [atom]: {
                    ...state.spectrum[atom],
                    [ion]: spectrum,
                },
            }
        },
    },
})

export const { pushSpectrum } = spectrumSlice.actions

export const spectrum = spectrumSlice.reducer
