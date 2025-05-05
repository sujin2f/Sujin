'use server'
import type { CSSProperties, PropsWithChildren } from 'react'
/* Components */
import GlobalWrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'

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
