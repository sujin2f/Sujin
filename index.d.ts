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
        type: string
        slug: string
        page: string
    }>
}

type EtherDataProps = {
    type: 'ether' | 'orbital'
    atom: string
    ion: string
}

type EtherDataServerProps = {
    params: Promise<EtherDataProps>
}
