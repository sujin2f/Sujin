import type { PropsWithChildren } from 'react'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { Excerpt } from '@app/recipe/_components/Excerpt'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
/* Utils */
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
/* Assets */
import './style.scss'

export default async function Layout({ children }: PropsWithChildren) {
    const user = await getCurrentUser().catch(() => undefined)
    return (
        <Wrapper
            menu={MENU_NAMES.MAIN}
            className="wrapper--recipe sujin"
            large={8}
            largeOffset={2}
            small={12}
            title="Recipe"
            excerpt={<Excerpt user={user} />}
        >
            <article className="--gap--bottom">{children}</article>
        </Wrapper>
    )
}
