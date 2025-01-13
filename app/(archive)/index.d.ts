export type Param = {
    slug: string
    page: string
}

export type ParamPromise = {
    params: Promise<Param>
}
