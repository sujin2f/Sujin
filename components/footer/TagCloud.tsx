import React, { use } from 'react'
import Link from 'next/link'

import type { TagCloud as TagCloudType } from '@src/types/wordpress'

import '@src/scss/tag-cloud.scss'

type Props = {
    readonly request: Promise<TagCloudType[]>
}

export function TagCloud({ request }: Props) {
    const tagCloud = use(request)

    return (
        <section className="widget--tag-cloud">
            {tagCloud.slice(0, 20).map((tag) => (
                <Link
                    className={`tag-cloud tag-cloud--size-${tag.count} tag-cloud--color-${tag.hit}`}
                    key={`tag-${tag.id}`}
                    title={tag.title}
                    href={`/tag/${tag.slug}`}
                >
                    {tag.title}
                </Link>
            ))}
        </section>
    )
}
