import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { T_Background } from '@sujin/lib/types'

const initialState: T_Background[] = []

export const backgroundSlice = createSlice({
    name: 'background',
    initialState,
    reducers: {
        setBackground: (state, action: PayloadAction<T_Background[]>) => {
            state.length = 0
            state.push(...action.payload)
        },
    },
})

export const { setBackground } = backgroundSlice.actions

export const background = backgroundSlice.reducer
