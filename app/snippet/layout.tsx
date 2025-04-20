import type { PropsWithChildren } from 'react'
/* Components */
import GlobalWrapper from '@app/_components/Wrapper'
import { Excerpt } from '@app/snippet/excerpt'
import { AdminWrapperServer } from '@app/_components/session/AdminWrapperServer'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
import { authOptions } from '@app/api/auth/constants'
/* Utils */
import { getServerSession } from 'next-auth'
/* Assets */
import '@app/snippet/style.scss'

export default async function LayoutSnippet({ children }: PropsWithChildren) {
    const session = await getServerSession(authOptions)

    return (
        <AdminWrapperServer>
            <GlobalWrapper
                menu={MENU_NAMES.MAIN}
                className="wrapper--snippet"
                large={12}
                small={12}
                title="Code Snippet"
                excerpt={<Excerpt name={session?.user?.name || undefined} />}
            >
                <article>{children}</article>
            </GlobalWrapper>
        </AdminWrapperServer>
    )
}
