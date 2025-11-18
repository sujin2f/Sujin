import type { PropsWithChildren } from 'react'
/* Components */
import { PrevNext } from '@lib/components/single/PrevNext'
/* CONSTANTS */
import { PER_PAGE } from '@sujin/lib/constants'

type Props = {
    readonly page: number
    readonly length: number
    readonly path: string
}

export const PrevNextAdmin = ({
    page,
    length,
    path,
}: PropsWithChildren<Props>) => {
    const prev = page !== 1 && {
        title: 'Prev',
        link: `/next-admin/${path}/${page - 1}`,
    }
    const next = length === PER_PAGE && {
        title: 'Next',
        link: `/next-admin/${path}/${page + 1}`,
    }

    return <PrevNext prev={prev} next={next} />
}
