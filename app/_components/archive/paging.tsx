'use client'

import React from 'react'

import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Paging as PagingComponent } from '@common/components/containers/Paging'

type Props = {
    readonly pages: number
    readonly page: number
    readonly urlPrefix: string
}

export const Paging = ({ pages, page, urlPrefix }: Props) => {
    return (
        <Row>
            <Column small={12}>
                {pages && pages > 1 ? (
                    <PagingComponent
                        totalPages={pages}
                        currentPage={page}
                        urlPrefix={urlPrefix}
                    />
                ) : (
                    <></>
                )}
            </Column>
        </Row>
    )
}
