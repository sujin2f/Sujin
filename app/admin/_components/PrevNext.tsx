import React, { type PropsWithChildren } from 'react'
/* Components */
import { PrevNext as PrevNextComponent } from '@app/(single)/_components/PrevNext'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import type { PostType } from '@app/_lib/data/mysql/types'

type Props = {
    page: number
    length: number
    path: string
}

export const PrevNext = ({ page, length, path }: PropsWithChildren<Props>) => {
    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/${path}/${page - 1}`,
              } as PostType)
            : undefined
    const next =
        length === PER_PAGE
            ? ({
                  title: 'Next',
                  link: `/admin/${path}/${page + 1}`,
              } as PostType)
            : undefined

    return <PrevNextComponent posts={[prev, next]} />
}

export default PrevNext
