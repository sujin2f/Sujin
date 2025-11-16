'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Utils */
import { updatePage } from '@lib/apollo/mutation/updatePage'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await updatePage(slug)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
