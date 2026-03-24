import type { PropsWithChildren } from 'react'
/* Components */
import { Main } from '@app/_components/html-elements/Main'

export default async function Layout({ children }: PropsWithChildren) {
    return <Main>{children}</Main>
}
