/* Components */
import GlobalWrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import '@app/snippet/style.scss'
import { AdminWrapperServer } from '@app/_components/session/AdminWrapperServer'

export default async function Wrapper({ children }: PropsWithChildren) {
    return (
        <AdminWrapperServer>
            <GlobalWrapper
                menu={MENU_NAMES.MAIN}
                className="wrapper--snippet"
                large={12}
                small={12}
                title="Code Snippet"
                excerpt={
                    <div>
                        Description and Login here{' '}
                        <Link href="/snippet/your">Go</Link>
                    </div>
                }
            >
                <article>{children}</article>
            </GlobalWrapper>
        </AdminWrapperServer>
    )
}
