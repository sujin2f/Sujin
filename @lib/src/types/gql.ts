import type { ARCHIVE } from '../constants'
import type { T_Recipe } from './recipe'

export type T_GQL_Params_Id = {
    _id: string
}

export type T_GQL_Params_Slug = {
    slug: string
}

export type T_GQL_Params_Archive_Type = {
    type: ARCHIVE
}

export type T_GQL_Params_Page = {
    page: number
}

export type GQL_SlugArg = {
    slug: string
}

export type T_GQL_Params_Spectrum = {
    number: number
    ion: number
}

export type T_GQL_Params_Recipes = T_GQL_Params_Page & {
    mine: boolean
}

export type T_GQL_Params_Recipe_Mutate = {
    recipe: T_Recipe
}

export type T_GQL_Params_Posts = T_GQL_Params_Archive_Type &
    T_GQL_Params_Slug &
    T_GQL_Params_Page
