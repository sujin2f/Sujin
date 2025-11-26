import { type PropsWithChildren } from 'react'
import { WrapperNew } from '@lib/components/WrapperNew'
import { Footer } from '@lib/components/footer'
import FixedHeader from '@lib/components/header/FixedHeader'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import '@app/(single)/layout.scss'

export default async function SingleLayout({ children }: PropsWithChildren) {
    return (
        <WrapperNew>
            <FixedHeader menu={MENU_NAMES.MAIN} />
            {children}
            <Footer />
        </WrapperNew>
    )
}
