import type { PropsWithChildren } from 'react'
/* CONSTANTS */
import { TAILWIND_MAIN } from '@app/_lib/constants'

export default async function Layout({ children }: PropsWithChildren) {
    return <article className={`${TAILWIND_MAIN}`}>{children}</article>
}
