import type { languages } from '@sujin/share/constants/helper'

import type { T_User } from './user'

export type T_Snippets = {
    user: T_User
    title: string
    snippets: T_Snippet[]
    tags: string[]
}

export type T_Snippet = {
    code: string
    type: (typeof languages)[number]
}

export type T_Snippet_User = {
    user: T_User
    snippets: T_Snippets
}
