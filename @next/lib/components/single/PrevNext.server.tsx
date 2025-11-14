'use client'
import { use } from 'react'
/* Components */
import { PrevNext as Component } from '@lib/components/single/PrevNext'
import { T_PrevNext } from '@sujin/lib/types'

interface Props {
    promise: Promise<T_PrevNext[]>
}

export const PrevNext = ({ promise }: Props) => {
    const [prev, next] = use(promise)
    if (!prev && !next) return <></>
    return <Component prev={prev} next={next} />
}
