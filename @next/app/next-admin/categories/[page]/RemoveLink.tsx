'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* Utils */
import { removeCategory } from '@lib/apollo/queries/wordpress/archives/removeCategory'

type Props = {
    readonly slug: string
}

export function RemoveLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await removeCategory(slug)
                router.refresh()
            }}
        >
            Remove
        </Link>
    )
}
