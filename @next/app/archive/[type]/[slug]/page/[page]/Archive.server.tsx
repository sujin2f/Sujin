import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Banner } from '@app/@banner/_components'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Cards } from '@lib/components/archive/Cards'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
import { category as getCategory } from '@lib/apollo/queries/wordpress/archives/category'
import { tag as getTag } from '@lib/apollo/queries/wordpress/archives/tag'
import { posts as getPosts } from '@lib/apollo/queries/wordpress/posts/posts'
/* Utils */
import { gqlRequest, publish } from '@app/_lib/redis'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await gqlRequest(
        async () => await (type === ARCHIVE.CATEGORY ? getCategory(slug) : getTag(slug)),
        `${COLLECTION.ARCHIVE}-${type}-${slug}`,
    )
        .then((result) => {
            if (!result.slug) {
                throw new Error(`🤬 Archive ${type} ${slug} ${page} request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })
    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        publish('update-hits', JSON.stringify([slug]))
    }

    const posts = await gqlRequest(
        async () => await getPosts(type, slug, page),
        `${COLLECTION.POST}-archive-${type}-${slug}-${page}`,
    )
        .then((result) => {
            if (!result.items.length) {
                throw new Error(`🤬 Posts from ${type} ${slug} ${page} request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })

    return (
        <>
            <Banner menu={MENU_NAMES.MAIN} title={title} excerpt={excerpt} prefix={type} background={image} />
            <Row>
                <Column>
                    <Cards
                        keyPrefix={`${type}-${slug}-${page}`}
                        posts={posts}
                        listKey="items"
                        page={page}
                        pageURLPrefix={`/${type}/${slug}/page`}
                        large={4}
                        medium={6}
                        small={12}
                    />
                </Column>
            </Row>
        </>
    )
}
