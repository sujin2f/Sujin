export type Props = {
    readonly totalPages: number
    readonly urlPrefix: string
    readonly currentPage: number
    readonly pageOffset?: number
}

type Item = {
    text: number
    link: string
    ellipsis: boolean
}

export const usePage = (props: Props) => {
    const { totalPages, urlPrefix, currentPage, pageOffset = 5 } = props

    const entities: Item[] = []

    if (totalPages !== 1) {
        const start = currentPage - pageOffset > 2 ? currentPage - pageOffset : 1
        const end = currentPage + pageOffset < totalPages - 1 ? currentPage + pageOffset : totalPages

        if (start > 2) {
            entities.push({
                text: 1,
                link: `${urlPrefix}/1`,
                ellipsis: false,
            })
            entities.push({
                text: -1,
                link: '',
                ellipsis: true,
            })
        }

        Array.from(Array(end - start + 1).keys()).forEach((v) => {
            entities.push({
                text: v + start,
                link: `${urlPrefix}/${v + start}`,
                ellipsis: false,
            })
        })

        if (end < totalPages - 1) {
            entities.push({
                text: -1,
                link: '',
                ellipsis: true,
            })
            entities.push({
                text: totalPages,
                link: `${urlPrefix}/${totalPages}`,
                ellipsis: false,
            })
        }
    }

    return entities
}
