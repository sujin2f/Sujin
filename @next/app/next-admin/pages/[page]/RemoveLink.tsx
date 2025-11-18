'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* Utils */
import { removePage } from '@lib/apollo/queries/wordpress/pages/removePage'

type Props = {
    readonly slug: string
}

export function RemoveLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await removePage(slug)
                router.refresh()
            }}
        >
            Remove
        </Link>
    )
}
