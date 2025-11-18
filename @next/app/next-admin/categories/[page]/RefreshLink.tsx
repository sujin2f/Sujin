'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* Utils */
import { refreshCategory } from '@lib/apollo/queries/wordpress/archives/refreshCategory'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await refreshCategory(slug)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
