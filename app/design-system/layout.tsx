import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
/* Assets */
import '@app/scss/design-system.scss'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
    return children
}
