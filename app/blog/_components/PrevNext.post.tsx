'use client'
import React, { useRef, useState } from 'react'
/* Components */
import { PrevNext } from '@app/blog/_components/PrevNext'
/* Utils */
import useIntersectionObserver from '@app/_lib/hooks/useIntersectionObserver'
import { useServerAction } from '@app/_lib/hooks/useServerAction'
/* T_Type */
import type { T_PrevNext } from '@common/types'

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
