'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Utils */
import { refreshPost } from '@lib/apollo/queries/wordpress/posts/refreshPost'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await refreshPost(slug)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
