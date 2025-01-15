'use client'

import React, { Suspense, useEffect, useState } from 'react'

import { useContext } from '@src/store'
import { setBanner, setWrapperClass } from '@src/store/actions'
import { WrapperClient } from '@app/components/archive/wrapper-client'
import { fetchGQL } from '@common/graphql/fetchGQL'
import { archiveOpr, queryRecent } from '@src/constants/graphql'
import { Term } from '@src/types/wordpress'
import { Loading } from '@app/components/archive/loading'
import { WidgetTitle } from '@app/components/WidgetTitle'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

export default function NotFound() {
    const [, dispatch] = useContext()
    const [request, setRequest] = useState<Promise<Term>>()

    useEffect(() => {
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title: '404 Not Found',
                excerpt:
                    'We cannot find the result. See below for recent articles.',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch])

    useEffect(() => setRequest(fetchGQL(queryRecent, archiveOpr)), [])

    return (
        <>
            <Row>
                <Column small={12}>
                    <WidgetTitle>Recent Posts</WidgetTitle>
                </Column>
            </Row>

            <Suspense
                fallback={
                    <Loading
                        className="archive"
                        counts={12}
                        large={4}
                        medium={6}
                        small={12}
                    />
                }
            >
                {request && <WrapperClient term={request} />}
            </Suspense>
        </>
    )
}
