export type Props = {
    readonly totalPages: number
    readonly urlPrefix: string
    readonly currentPage: number
    readonly pageOffset?: number
    readonly onClick?: (page: number) => void
}

type Item = {
    text: number
    link: string
    ellipsis: boolean
}

export const usePage = (props: Props): Item[] => {
    const { totalPages, urlPrefix, currentPage, pageOffset = 5 } = props

    // ⭐️ Not available
    if (totalPages === 1) return []

    const offset = Array(pageOffset * 2 + 1)
        .keys()
        .map((key) => key + currentPage - pageOffset)
    const ellipsis = {
        text: -1,
        link: '',
        ellipsis: true,
    }

    let cursor = 1
    return [1, ...offset, totalPages]
        .map((v) => {
            if (v < cursor) return -1
            if (cursor >= totalPages) return -1

            const item = {
                text: v,
                link: `${urlPrefix}/${v}`,
                ellipsis: false,
            }

            if (cursor === v) {
                cursor += 1
                return item
            }

            if (cursor + 1 < v && v === totalPages) {
                cursor = totalPages + 1
                return [ellipsis, item]
            }

            if (cursor + 1 < v) {
                cursor = v
                return [ellipsis, item]
            }

            cursor = v
            return item
        })
        .flat()
        .filter((v) => v !== -1)
}
