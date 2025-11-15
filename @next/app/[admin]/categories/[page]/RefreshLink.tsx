'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* Utils */
import { mutateCategory } from '@lib/apollo/mutation/mutateCategory'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await mutateCategory(slug)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
