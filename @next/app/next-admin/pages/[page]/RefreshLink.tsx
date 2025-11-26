'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Utils */
import { refreshPage } from '@lib/apollo/queries/wordpress/pages/refreshPage'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await refreshPage(slug)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
