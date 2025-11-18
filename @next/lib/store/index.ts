import { configureStore } from '@reduxjs/toolkit'
import { flickr } from './slices/flickr'
import { background } from './slices/background'
import { tagCloud } from './slices/tag-cloud'
import { recent } from './slices/recent'
import { spectrum } from './slices/spectrum'

export const store = configureStore({
    reducer: {
        flickr,
        background,
        tagCloud,
        recent,
        spectrum,
    },
})

export type RootState = ReturnType<typeof store.getState>
