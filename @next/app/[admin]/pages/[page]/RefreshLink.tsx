'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* Utils */
import { mutatePage } from '@lib/apollo/mutation/mutatePage'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await mutatePage(slug)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
