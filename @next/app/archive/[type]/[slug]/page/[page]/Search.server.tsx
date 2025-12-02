import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Cards } from '@lib/components/archive/Cards'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
import { search } from '@lib/apollo/queries/wordpress/posts/search'
/* Utils */
import { gqlRequest } from '@lib/utils/redis'

type Props = {
    slug: string
    page: number
}

export async function SearchServer({ slug, page }: Props) {
    const posts = await gqlRequest(async () => await search(slug, page), {
        key: `${COLLECTION.POST}-search-${slug}-${page}`,
    }).catch((e) => {
        Logger.error(e.message)
        notFound()
    })

    return (
        <>
            <Banner menu={MENU_NAMES.MAIN} title={`Search Result: ${decodeURIComponent(slug)}`} prefix={'Search'} />
            <Row>
                <Column>
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
                </Column>
            </Row>
        </>
    )
}
