import { headers } from 'next/headers'
import { TermTypes } from '@src/types/wordpress'
import { PropsWithChildren } from 'react'
import { Nullable } from '@common/types'
import { getTermBy } from '@src/db/mysql/getTermBy'

export const generateMetadata = async () => {
    const headersList = headers()
    const referer = (await headersList).get('referer')
    console.log(referer)
    const url = new URL(referer || '')
    const match = url.pathname.match(/([a-zA-Z0-9]+)/gi)

    if (!match) {
        return {}
    }

    const [, slug, , page] = match

    // const [] = match
    let termType: Nullable<TermTypes> = undefined
    switch (match[0]) {
        case TermTypes.category:
            termType = TermTypes.category
            break
        case TermTypes.tag:
            termType = TermTypes.tag
            break
        case TermTypes.search:
            termType = TermTypes.search
            break
    }

    if (!termType) {
        return {}
    }

    const category = await getTermBy(termType, slug, page ? parseInt(page) : 1)

    if (!category) {
        return {}
    }

    return {
        title: `Sujin | ${category.title}`,
        description: category.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${category.title}`,
            url: referer,
        },
        metadataBase: url,
    }
}

export default function ArchiveLayout({ children }: PropsWithChildren) {
    return children
}
