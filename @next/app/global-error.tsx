'use client'
/* Components */
import FixedHeader from '@lib/components/header/FixedHeader'
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function GlobalError({ error }: { error: Error & { digest?: string }; reset?: () => void }) {
    const title = error.name !== 'Error' ? error.name : 'Something went wrong'
    return (
        <>
            <FixedHeader menu={MENU_NAMES.MAIN} />
            <Banner title={title} menu={MENU_NAMES.MAIN} excerpt={error?.message} fullHeight />
        </>
    )
}
