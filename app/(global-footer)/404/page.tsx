'use client'

import React, { Suspense, useEffect, useState } from 'react'

import { WrapperClient } from '@components/(wordpress)/archive/wrapper-client'
import fetchGQL from '@common/graphql/fetchGQL'
import { archiveOpr, queryRecent } from '@src/constants/graphql'
import { Term } from '@src/types/wordpress'
import { Loading } from '@components/(wordpress)/archive/loading'
import { WidgetTitle } from '@components/WidgetTitle'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

export default function NotFound() {
    const [request, setRequest] = useState<Promise<Term>>()
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
