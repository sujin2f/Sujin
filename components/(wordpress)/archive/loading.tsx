'use client'

import React from 'react'

import { Row } from '@common/components/layout/Row'
import { Column, OneToTwelve } from '@common/components/layout/Column'
import { Arr } from '@common/model/Array'

import '@src/scss/loading.scss'

type Props = {
    readonly className?: string
    readonly counts: number
    readonly fullWidth?: boolean
    readonly large?: OneToTwelve
    readonly medium?: OneToTwelve
    readonly small?: OneToTwelve
}

export const Loading = (props: Props) => {
    const { counts, large, medium, small, fullWidth } = props
    const className = props.className && `loader--${props.className}`
    return (
        <Row className={`loader ${className}`} fullWidth={fullWidth}>
            {new Arr(counts || 12).map((_, index: number) => (
                <Column
                    key={`${index}`}
                    large={large}
                    medium={medium}
                    small={small}
                >
                    <div className="loader__animation" />
                </Column>
            ))}
        </Row>
    )
}
