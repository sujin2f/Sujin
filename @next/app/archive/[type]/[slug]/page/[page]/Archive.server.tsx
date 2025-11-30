import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import { category as getCategory } from '@lib/apollo/queries/wordpress/archives/category'
import { tag as getTag } from '@lib/apollo/queries/wordpress/archives/tag'
import { posts as getPosts } from '@lib/apollo/queries/wordpress/posts/posts'
/* Utils */
import { updateHits } from '@lib/apollo/queries/wordpress/archives/updateHits'
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await redisCachedRequest(
        async () => await (type === ARCHIVE.CATEGORY ? getCategory(slug) : getTag(slug)),
        {
            key: `${COLLECTION.ARCHIVE}-${type}-${slug}`,
        },
    ).catch((e) => {
        Logger.error(e.message)
        notFound()
    })
    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        await updateHits(slug)
    }

    const posts = await redisCachedRequest(async () => await getPosts(type, slug, page), {
        key: `${COLLECTION.POST}-archive-${type}-${slug}-${page}`,
    }).catch((e) => {
        Logger.error(e.message)
        notFound()
    })

    return (
        <Wrapper title={title} excerpt={excerpt} prefix={type} background={image}>
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
        </Wrapper>
    )
}
