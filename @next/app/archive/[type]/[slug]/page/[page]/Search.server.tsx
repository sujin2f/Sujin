import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import { search } from '@lib/apollo/queries/wordpress/posts/search'
/* Utils */
import { nextCachedRequest } from '@lib/apollo/queries/GQLRequest'

type Props = {
    slug: string
    page: number
}

export async function SearchServer({ slug, page }: Props) {
    const posts = await nextCachedRequest(
        search(slug, page),
        COLLECTION.ARCHIVE,
        'posts',
        'search',
        slug,
        page.toString(),
    ).catch((e) => {
        Logger.error(e.message)
        notFound()
    })

    return (
        <Wrapper title={`Search Result: ${decodeURIComponent(slug)}`} prefix={'Search'}>
            <Cards
                keyPrefix={`${ARCHIVE.SEARCH}-${slug}-${page}`}
                posts={posts}
                listKey="items"
                page={page}
                pageURLPrefix={`/${ARCHIVE.SEARCH}/${slug}/page`}
                large={4}
                medium={6}
                small={12}
            />
        </Wrapper>
    )
}
