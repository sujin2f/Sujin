'use server'
import Image from 'next/image'
/* Components */
import { Banner } from '@app/@banner/_components'
import { WidgetTitle } from '@app/_components/WidgetTitle'
import Card from '@app/archive/_components/Card'
import { Tags } from '@app/blog/_components/Tags'
import { Main } from '@app/_components/html-elements/Main'
/* Utils */
import { getRecent } from '@app/blog/_lib/getRecent'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
import { TAILWIND_CARD_IMAGE } from './_lib/constants'

export default async function NotFound() {
    const recent = await getRecent()
    const posts = recent ? recent.slice(0, 12) : null

    return (
        <>
            <Banner
                menu="primary"
                title="404 Not Found"
                excerpt="We cannot find the result. See below for recent articles."
            />
            <Main>
                <WidgetTitle>Recent Posts</WidgetTitle>
                <ul className={`grid grid-cols-1 gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2`}>
                    {posts &&
                        posts.map((post: T_ArchivePost, index: number) => {
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
                                    key={`not-found-${index}-${post._id}`}
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
                </ul>
            </Main>
        </>
    )
}
