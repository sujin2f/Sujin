type PageProps = {
    params: Promise<{
        slug: string
    }>
}

type PostProps = {
    params: Promise<{
        date: string[]
    }>
}

type ArchiveProps = {
    params: Promise<{
        type: TermTypes
        slug: string
        page: number
    }>
}
