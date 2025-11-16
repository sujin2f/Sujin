'use client'
import React, { useRef, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
/* Components */
import { PrevNext } from '@lib/components/single/PrevNext'
/* CONSTANTS */
import { FIELDS } from '@lib/constants/graphql-fields'
/* Utils */
import { client } from '@lib/apollo/apollo-client-frontend'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* T_Type */
import type { T_PrevNext } from '@sujin/lib/types'

type Props = {
    slug: string
}

export const PrevNextPost = ({ slug }: Props) => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ prevNext: T_PrevNext[] }>(
        gql`
            query PrevNext($slug: String!) {
                prevNext(slug: $slug) { ${FIELDS['POST_PREV_NEXT']} }
            }
        `,
        { skip, client, variables: { slug } },
    )
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error || loading || !data) {
        return <div ref={ref} />
    }

    const [prev, next] = data?.prevNext
    if (!prev && !next) return <></>
    return <PrevNext prev={prev} next={next} />
}
