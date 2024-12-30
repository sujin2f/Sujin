import React, { PropsWithChildren } from 'react'

import { Row } from './Row'
import { Column } from './Column'
import { className as getClassName } from 'src/common/utils/string'

import 'src/common/scss/top-bar.scss'

type Props = {
    left?: JSX.Element
    right?: JSX.Element
    className?: string
    fullWidth?: boolean
    fixed?: boolean
}

export const TopBar = (props: PropsWithChildren<Props>): JSX.Element => {
    const { left, right, fullWidth, children, fixed } = props
    const className = getClassName(
        'top-bar',
        props.className,
        fixed && 'top-bar--fixed',
    )
    return (
        <Row className={className} dom="section" fullWidth={fullWidth}>
            {left && <Column small={6}>{left}</Column>}
            {right && <Column small={6}>{right}</Column>}
            {children}
        </Row>
    )
}
