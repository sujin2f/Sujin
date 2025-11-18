'use server'
import type { CSSProperties, PropsWithChildren } from 'react'
/* Components */
import GlobalWrapper from '@lib/components/Wrapper'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'

type Props = {
    readonly style?: CSSProperties
    readonly menu?: MENU_NAMES
}

export default async function Wrapper({
    children,
    style,
    menu,
}: PropsWithChildren<Props>) {
    return (
        <GlobalWrapper
            menu={menu || MENU_NAMES.ETHER}
            large={8}
            small={12}
            largeOffset={2}
        >
            <article style={style}>{children}</article>
        </GlobalWrapper>
    )
}
