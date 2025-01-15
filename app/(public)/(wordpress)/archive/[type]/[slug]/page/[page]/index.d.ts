import { TermTypes } from '@src/types/wordpress'

export type Param = {
    type: TermTypes
    slug: string
    page: number
}

export type ParamPromise = {
    params: Promise<Param>
}
