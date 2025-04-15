'use client'

import React from 'react'

import { Row } from '@common/components/layout/Row'
import { Column, ColumnProps } from '@common/components/layout/Column'
import { map } from '@common/utils/array'

type Props = ColumnProps & {
    readonly className?: string
    readonly counts: number
    readonly fullWidth?: boolean
}

export const Loading = ({
    larger,
    large,
    medium,
    small,
    largerOffset,
    largeOffset,
    mediumOffset,
    smallOffset,
    counts,
    fullWidth,
    ...props
}: Props) => {
    const className = props.className && `loader--${props.className}`
    return (
        <Row className={`loader ${className}`} fullWidth={fullWidth}>
            {map(counts, (_, index: number) => (
                <Column
                    key={`${index}`}
                    larger={larger}
                    large={large}
                    medium={medium}
                    small={small}
                    largerOffset={largerOffset}
                    largeOffset={largeOffset}
                    mediumOffset={mediumOffset}
                    smallOffset={smallOffset}
                >
                    <div className="loader__animation" />
                </Column>
            ))}
        </Row>
    )
}
