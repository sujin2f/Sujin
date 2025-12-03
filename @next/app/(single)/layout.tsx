import { type PropsWithChildren } from 'react'
import { Wrapper } from '@lib/components/Wrapper'
import { Footer } from '@lib/components/footer'
import FixedHeader from '@lib/components/header/FixedHeader'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import '@app/(single)/layout.scss'

export default async function SingleLayout({ children }: PropsWithChildren) {
    return (
        <Wrapper>
            <FixedHeader menu={MENU_NAMES.MAIN} />
            {children}
            <Footer />
        </Wrapper>
    )
}
