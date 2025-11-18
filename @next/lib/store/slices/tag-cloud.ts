import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { T_Archive } from '@sujin/lib/types'

const initialState: T_Archive[] = []

export const tagCloudSlice = createSlice({
    name: 'tagCloud',
    initialState,
    reducers: {
        setTagCloud: (state, action: PayloadAction<T_Archive[]>) => {
            state.length = 0
            state.push(...action.payload)
        },
    },
})

export const { setTagCloud } = tagCloudSlice.actions

export const tagCloud = tagCloudSlice.reducer
