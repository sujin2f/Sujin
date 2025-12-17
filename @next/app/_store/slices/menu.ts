import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { MenuItem } from '@sujin/lib/types/menu'

const initialState: { mobile: boolean; items: Record<string, MenuItem[]> } = { mobile: false, items: {} }

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setMenu: (state, action: PayloadAction<[string, MenuItem[]]>) => {
            const [key, items] = action.payload
            state.items[key] = items
        },
        setMobile: (state, action: PayloadAction<boolean>) => {
            state.mobile = action.payload
        },
    },
})

export const { setMenu, setMobile } = menuSlice.actions

export const menu = menuSlice.reducer
