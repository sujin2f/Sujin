import type { PropsWithChildren } from 'react'
/* Components */
import Wrapper from '@app/_components/Wrapper'
// import { Excerpt } from '@app/snippet/excerpt'
import { AdminWrapperServer } from '@app/_components/session/AdminWrapperServer'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
// import { authOptions } from '@app/api/auth/constants'
// /* Utils */
// import { getServerSession } from 'next-auth'
/* Assets */
import './style.scss'

export default async function Layout({ children }: PropsWithChildren) {
    // const session = await getServerSession(authOptions)

    return (
        <AdminWrapperServer>
            <Wrapper
                menu={MENU_NAMES.MAIN}
                className="wrapper--recipe sujin"
                large={12}
                small={12}
                title="Recipe"
                // excerpt={<Excerpt name={session?.user?.name || undefined} />}
            >
                <article>{children}</article>
            </Wrapper>
        </AdminWrapperServer>
    )
}
