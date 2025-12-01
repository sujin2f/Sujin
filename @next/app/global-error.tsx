'use client'
/* Components */
import { Wrapper } from '@lib/components/Wrapper'
import FixedHeader from '@lib/components/header/FixedHeader'
import { Banner } from '@lib/components/header/Banner'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import style from '@app/front-page.module.scss'

export default function GlobalError({ error }: { error: Error & { digest?: string }; reset?: () => void }) {
    const title = error.name !== 'Error' ? error.name : 'Something went wrong'
    return (
        <Wrapper>
            <FixedHeader menu={MENU_NAMES.MAIN} />
            <Banner title={title} menu={MENU_NAMES.MAIN} excerpt={error?.message} style={style} />
        </Wrapper>
    )
}
