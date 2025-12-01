import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import { Wrapper } from '@lib/components/Wrapper'
import { Footer } from '@lib/components/footer'
import FixedHeader from '@lib/components/header/FixedHeader'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'
import { category as getCategory } from '@lib/apollo/queries/wordpress/archives/category'
import { tag as getTag } from '@lib/apollo/queries/wordpress/archives/tag'

type Props = {
    params: Promise<{
        type: string
        slug: string
        page: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)
    const type = params.type as ARCHIVE

    if (Object.keys(ARCHIVE).includes(type)) {
        return {}
    }

    if (type === ARCHIVE.SEARCH) {
        return {
            title: `Sujin | Search result | ${slug}`,
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
    }

    // TODO thumbnail
    const archive = await redisCachedRequest(
        async () => await (type === ARCHIVE.CATEGORY ? getCategory(slug) : getTag(slug)),
        {
            key: `${COLLECTION.ARCHIVE}-${type}-${slug}`,
        },
    ).catch(() => {})

    if (!archive) {
        return {
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
    }
    const url = `${process.env.BASE_URL}/archive/${type}/${slug}/page/${page}`

    return {
        title: `Sujin | ${archive.title}`,
        description: archive.excerpt,
        openGraph: {
            title: `Sujin | ${archive.title}`,
            url: url,
        },
    }
}

export default async function LayoutRecipe({ children }: PropsWithChildren) {
    return (
        <Wrapper>
            <FixedHeader menu={MENU_NAMES.MAIN} />
            {children}
            <Footer />
        </Wrapper>
    )
}
