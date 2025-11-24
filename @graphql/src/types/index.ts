import type { Response as expressResponse } from 'express'

export type Context = {
    token: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response = expressResponse<any, Record<string, any>>
export type T_Context = {
    token: string
    res: Response
}
