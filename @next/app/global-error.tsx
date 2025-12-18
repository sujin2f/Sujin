'use client'
/* Components */
import TopBar from '@app/@topbar/_components'
import { Banner } from '@app/@banner/_components'

export default function GlobalError({ error }: { error: Error & { digest?: string }; reset?: () => void }) {
    const title = error.name !== 'Error' ? error.name : 'Something went wrong'
    return (
        <>
            <TopBar menu="primary" />
            <Banner title={title} menu="primary" excerpt={error?.message} fullHeight />
        </>
    )
}
