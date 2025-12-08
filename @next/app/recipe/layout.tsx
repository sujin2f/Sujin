'use server'
import type { PropsWithChildren } from 'react'

export default async function PageRecipe({ children }: PropsWithChildren) {
    return <main className="container mx-auto max-w-4xl my-15">{children}</main>
}
