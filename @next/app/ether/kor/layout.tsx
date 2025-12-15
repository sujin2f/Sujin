import type { PropsWithChildren } from 'react'
/* CONSTANTS */
import { TAILWIND_MAIN } from '@app/_lib/constants'

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
    return <article className={`${TAILWIND_MAIN} max-w-4xl`}>{children}</article>
}
