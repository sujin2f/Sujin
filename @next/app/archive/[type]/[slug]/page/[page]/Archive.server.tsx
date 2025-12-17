import Image from 'next/image'
import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import Card from '@app/archive/_components/Card'
import { Tags } from '@app/blog/_components/Tags'
import { Paging } from '@app/archive/_components/Paging'
import { Main } from '@app/_components/html-elements/Main'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
import { TAILWIND_CARD_IMAGE } from '@app/_lib/constants'
/* Utils */
import { publish } from '@app/_lib/redis'
import { getPosts } from '@app/archive/_lib/getPosts'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'

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
            if (!result || !result.items.length) {
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
            <Main dom="ul" className="grid grid-cols-1 gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
                {posts.map((post: T_ArchivePost, index: number) => {
                    const tags = post.archives ? post.archives.filter((term) => term.type === ARCHIVE.TAG) : []
                    const url = post.images && (post.images.list?.url || post.images.thumbnail?.url)
                    const image = (
                        <Image
                            src={url || '/assets/thumbnail.png'}
                            alt={post.title}
                            loading="lazy"
                            width={400}
                            height={300}
                            className={TAILWIND_CARD_IMAGE}
                        />
                    )

                    return (
                        <Card
                            key={`card-${type}-${slug}-${page}-${index}-${post._id}`}
                            title={post.title}
                            description={post.excerpt}
                            to={post.link}
                            timestamp={post.date}
                            image={image}
                            ratio="aspect-[4/3]"
                        >
                            <Tags items={tags} />
                        </Card>
                    )
                })}
            </Main>
            {page && <Paging totalPages={numPages} currentPage={page} urlPrefix={`/${type}/${slug}/page`} />}
        </>
    )
}
