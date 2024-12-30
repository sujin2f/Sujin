import React, { PropsWithChildren } from 'react'

import { Row } from './Row'
import { Column } from './Column'
import { className } from 'src/common/utils/string'

import 'src/common/scss/top-bar.scss'

type Props = {
    left?: JSX.Element
    right?: JSX.Element
    className?: string
    fullWidth?: boolean
}

export const TopBar = (props: PropsWithChildren<Props>): JSX.Element => {
    const { left, right, className: cls, fullWidth, children } = props
    return (
        <Row
            className={className('top-bar', cls)}
            dom="section"
            fullWidth={fullWidth}
        >
            {left && <Column small={6}>{left}</Column>}
            {right && <Column small={6}>{right}</Column>}
            {children}
        </Row>
    )
}
