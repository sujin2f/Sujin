import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { T_ArchivePost } from '@common/types'

const initialState: T_ArchivePost[] = []

export const recentSlice = createSlice({
    name: 'recent',
    initialState,
    reducers: {
        setRecent: (state, action: PayloadAction<T_ArchivePost[]>) => {
            state.length = 0
            state.push(...action.payload)
        },
    },
})

export const { setRecent } = recentSlice.actions

export const recent = recentSlice.reducer
