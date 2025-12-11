'use client'
import Image from 'next/image'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import Card from '@app/archive/_components/Card'
import { Tags } from '@app/blog/_components/Tags'
/* Utils */
import { getRecent } from '@app/blog/_lib/getRecent'
import { setRecent } from '@app/_store/slices/recent'
import { map } from '@sujin/share/utils/array'
import { useStoreOrAction } from '@app/_hooks/useStoreOrAction'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
import { TAILWIND_CARD_IMAGE, TAILWIND_MAIN } from '@app/_lib/constants'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export function NotFoundClient() {
    const { ref, loading, error, data: recent } = useStoreOrAction('recent', getRecent, setRecent)

    if (error) {
        return
    }

    const posts = recent ? recent.slice(0, 12) : null

    return (
        <main ref={ref} className={TAILWIND_MAIN}>
            <WidgetTitle>Recent Posts</WidgetTitle>
            <ul className={`grid grid-cols-1 gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2`}>
                {(loading || !posts || !posts.length) &&
                    map(4, (_, index) => (
                        <li
                            key={`related-loading-${index}`}
                            className="bg-slate-500 aspect-video mb-4 animate-pulse"
                        ></li>
                    ))}
                {posts
                    ? posts.map((post: T_ArchivePost, index: number) => {
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
                      })
                    : ''}
            </ul>
        </main>
    )
}
