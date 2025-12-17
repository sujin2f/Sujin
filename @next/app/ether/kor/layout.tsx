import type { PropsWithChildren } from 'react'
/* Components */
import { Main } from '@app/_components/html-elements/Main'

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
    return (
        <Main dom="article" className="max-w-4xl">
            {children}
        </Main>
    )
}
