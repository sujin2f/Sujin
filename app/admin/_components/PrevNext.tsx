import type { PropsWithChildren } from 'react'
/* Components */
import { PrevNext as PrevNextComponent } from '@app/(single)/_components/PrevNext'
/* CONSTANTS */
import { PER_PAGE } from '@app/_lib/constants'

type Props = {
    readonly page: number
    readonly length: number
    readonly path: string
}

export const PrevNext = ({ page, length, path }: PropsWithChildren<Props>) => {
    const prev = page !== 1 && {
        title: 'Prev',
        link: `/admin/${path}/${page - 1}`,
    }
    const next = length === PER_PAGE && {
        title: 'Next',
        link: `/admin/${path}/${page + 1}`,
    }

    return <PrevNextComponent prev={prev} next={next} />
}
