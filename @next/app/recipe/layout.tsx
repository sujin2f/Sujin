'use server'
import type { PropsWithChildren } from 'react'
/* CONSTANTS */
import { TAILWIND_MAIN } from '@app/_lib/constants'

export default async function PageRecipe({ children }: PropsWithChildren) {
    return <main className={`${TAILWIND_MAIN} max-w-4xl`}>{children}</main>
}
