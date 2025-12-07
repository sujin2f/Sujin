import Image from 'next/image'
import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import Card from '@common/components/containers/Card'
import { Tags } from '@app/_components/single/Tags'
import { Paging } from '@common/components/containers/Paging'
/* CONSTANTS */
import { ARCHIVE, IMAGE_SIZE } from '@sujin/lib/constants'
import { getPosts } from '@app/archive/_lib/getPosts'
/* Utils */
import { publish } from '@app/_lib/redis'
import { T_ArchivePost } from '@sujin/lib/types'
import { getThumbnailFromPost } from '@lib/utils/client'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        publish('update-hits', JSON.stringify([slug]))
    }

    const result = await getPosts(type, slug, page)
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

    const { items: posts, numPages } = result

    return (
        <>
            <ul className="container mx-auto grid grid-cols-1 gap-6 mt-15 pb-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
                {posts.map((post: T_ArchivePost, index: number) => {
                    const tags = post.archives ? post.archives.filter((term) => term.type === ARCHIVE.TAG) : []
                    const url = post.images && (post.images.list?.url || post.images.thumbnail?.url)
                    const picture = (
                        <Image
                            src={url || '/assets/thumbnail.png'}
                            alt={post.title}
                            loading="lazy"
                            width={400}
                            height={300}
                            className="w-full h-full object-cover object-center"
                        />
                    )

                    return (
                        <Card
                            key={`card-${type}-${slug}-${page}-${index}-${post._id}`}
                            title={post.title}
                            description={post.excerpt}
                            to={post.link}
                            timestamp={post.date}
                            image={getThumbnailFromPost(post.images, [IMAGE_SIZE.THUMBNAIL, IMAGE_SIZE.POST_THUMBNAIL])}
                            ratio="aspect-[4/3]"
                            picture={picture}
                        >
                            <Tags items={tags} />
                        </Card>
                    )
                })}
            </ul>
            {page ? <Paging totalPages={numPages} currentPage={page} urlPrefix={`/${type}/${slug}/page`} /> : null}
        </>
    )
}
