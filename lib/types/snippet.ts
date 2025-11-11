import type { WithId } from 'mongodb'
import type { languages } from '@common/constants/helper'
import type { T_User } from '@lib/types/user'

export type T_Snippets = WithId<{
    user: T_User
    title: string
    snippets: T_Snippet[]
    tags: string[]
}>

export type T_Snippet = WithId<{
    code: string
    type: (typeof languages)[number]
}>

export type T_Snippet_User = WithId<{
    user: T_User
    snippets: T_Snippets
}>
