import { configureStore } from '@reduxjs/toolkit'
import { flickr } from './slices/flickr'
import { background } from './slices/background'
import { tagCloud } from './slices/tag-cloud'
import { recent } from './slices/recent'
import { spectrum } from './slices/spectrum'
import { menu } from './slices/menu'

export const store = configureStore({
    reducer: {
        flickr,
        background,
        tagCloud,
        recent,
        spectrum,
        menu,
    },
})

export type RootState = ReturnType<typeof store.getState>
