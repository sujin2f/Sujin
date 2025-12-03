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
import { category as getCategory } from '@lib/apollo/queries/wordpress/archives/category'
import { tag as getTag } from '@lib/apollo/queries/wordpress/archives/tag'
import { posts as getPosts } from '@lib/apollo/queries/wordpress/posts/posts'
/* Utils */
import { gqlRequest, getPublisher } from '@lib/utils/redis'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await gqlRequest(async () => await (type === ARCHIVE.CATEGORY ? getCategory(slug) : getTag(slug)), {
        key: `${COLLECTION.ARCHIVE}-${type}-${slug}`,
    }).catch((e) => {
        Logger.error(e.message)
        notFound()
    })
    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        getPublisher()
            .then((pub) => {
                // Update Tag Cloud
                pub.publish('updateHit', JSON.stringify([slug]))
            })
            .catch((e) => {
                Logger.info(e)
            })
    }

    const posts = await gqlRequest(async () => await getPosts(type, slug, page), {
        key: `${COLLECTION.POST}-archive-${type}-${slug}-${page}`,
    }).catch((e) => {
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
