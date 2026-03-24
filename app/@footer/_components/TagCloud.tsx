'use client'
import Link from 'next/link'
/* Components */
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Store */
import { setTagCloud } from '@app/_store/slices/tag-cloud'
/* Utils */
import { getTagCloud } from '@app/@footer/_lib/getTagCloud'
import { useStoreOrAction } from '@app/_lib/hooks/useStoreOrAction'
/* Assets */
import '@app/_lib/scss/tag-cloud.scss'

const TagCloud = () => {
    const { ref, loading, error, data: tagCloud } = useStoreOrAction('tagCloud', getTagCloud, setTagCloud)

    if (error) {
        return
    }

    // Data is not yet ready
    if (!tagCloud || !tagCloud.length) {
        return <div ref={ref} />
    }

    return (
        <ul className="tag-cloud flex flex-wrap gap-1 justify-center" ref={ref}>
            {loading && <LoadingArchive fullWidth counts={1} small={12} />}
            {tagCloud.slice(0, 20).map((tag) => (
                <li key={`tag-cloud-${tag.slug}-${tag.title}`}>
                    <Link
                        className={`tag-cloud tag-cloud--size-${tag.total} tag-cloud--color-${tag.hits}`}
                        title={tag.title}
                        href={`/tag/${tag.slug}`}
                    >
                        {tag.title}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
export default TagCloud
