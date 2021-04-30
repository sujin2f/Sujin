import { Background, MenuItem } from './wp'

type Slug = {
    slug: string
}

type Backgrounds = {
    backgrounds: Background[]
}

type MenuItems = {
    menuItems: MenuItem[]
}

type Action = {
    type: string
}

export type LoadMenuSuccess = Action & Slug & MenuItems
export type LoadBGSuccess = Action & Backgrounds
