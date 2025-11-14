'use client'
'use client'
import React, { useRef, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
/* Components */
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* T_Type */
import type { T_Archive } from '@sujin/lib/types'
import Link from 'next/link'

const TagCloud = () => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ tagCloud: T_Archive[] }>(
        gql`
            query TagCloud {
                tagCloud {
                    slug
                    title
                    total
                    hits
                }
            }
        `,
        { skip },
    )

    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error) {
        return <></>
    }

    return (
        <section className="widget--tag-cloud" ref={ref}>
            {loading && (
                <LoadingArchive
                    fullWidth
                    className="tag-cloud"
                    counts={1}
                    small={12}
                />
            )}
            {data &&
                data.tagCloud.length &&
                data.tagCloud.slice(0, 20).map((tag) => (
                    <Link
                        className={`tag-cloud tag-cloud--size-${tag.total} tag-cloud--color-${tag.hits}`}
                        key={`tag-cloud-${tag.slug}-${tag.title}`}
                        title={tag.title}
                        href={`/tag/${tag.slug}`}
                    >
                        {tag.title}
                    </Link>
                ))}
        </section>
    )
}
export default TagCloud
