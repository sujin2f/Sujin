'use server'
import type { PropsWithChildren } from 'react'
/* Components */
import { Main } from '@app/_components/html-elements/Main'

export default async function PageRecipe({ children }: PropsWithChildren) {
    return <Main className="max-w-4xl">{children}</Main>
}
