'use client'
import React, { useRef, useState } from 'react'
/* Components */
import { PrevNext } from '@app/_components/single/PrevNext'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
import { useServerAction } from '@app/_hooks/useServerAction'
/* T_Type */
import type { T_PrevNext } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_PrevNext[]>
}

export const PrevNextPost = ({ action }: Props) => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    // Read from GraphQL
    const { loading, error, data } = useServerAction(action, skip)
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error || loading || !data) {
        return <div ref={ref} />
    }

    const [prev, next] = data
    if (!prev && !next) return <></>
    return <PrevNext prev={prev} next={next} />
}
