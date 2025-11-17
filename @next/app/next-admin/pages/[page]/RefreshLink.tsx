'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
/* Utils */
import { updateSingle } from '@lib/apollo/mutation/single-update'
/* CONSTANTS */
import { POST_TYPE } from '@sujin/lib/constants'

type Props = {
    readonly slug: string
}

export function RefreshLink({ slug }: Props) {
    const router = useRouter()

    return (
        <Link
            href="#"
            onClick={async () => {
                await updateSingle(slug, POST_TYPE.PAGE)
                router.refresh()
            }}
        >
            Refresh
        </Link>
    )
}
