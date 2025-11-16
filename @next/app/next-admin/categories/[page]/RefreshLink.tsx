'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* Utils */
import { updateCategory } from '@lib/apollo/mutation/updateCategory'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await updateCategory(slug)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
