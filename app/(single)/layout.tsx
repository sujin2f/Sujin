import type { PropsWithChildren } from 'react'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'

/**
 * Layout component that wraps the application with common layout elements.
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
