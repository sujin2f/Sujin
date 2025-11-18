import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { T_FlickrImage } from '@sujin/lib/types'

const initialState: T_FlickrImage[] = []

export const flickrSlice = createSlice({
    name: 'flickr',
    initialState,
    reducers: {
        setFlickr: (state, action: PayloadAction<T_FlickrImage[]>) => {
            state.length = 0
            state.push(...action.payload)
        },
    },
})

export const { setFlickr } = flickrSlice.actions

export const flickr = flickrSlice.reducer
