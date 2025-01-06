import React, { JSX, PropsWithChildren } from 'react'

import { Row } from './Row'
import { Column } from './Column'
import { className as getClassName } from 'src/common/utils/string'

import 'src/common/scss/top-bar.scss'

type Props = {
    readonly left?: JSX.Element
    readonly right?: JSX.Element
    readonly className?: string
    readonly fullWidth?: boolean
    readonly fixed?: boolean
}

export function TopBar(props: PropsWithChildren<Props>) {
    const { left, right, fullWidth, children, fixed } = props
    const className = getClassName(
        'top-bar',
        props.className,
        fixed && 'top-bar--fixed',
    )
    return (
        <Row
            className={className}
            dom="section"
            fullWidth={fullWidth}
        >
            {left ? <Column small={6}>
                {left}
                    </Column> : null}

            {right ? <Column small={6}>
                {right}
                     </Column> : null}

            {children}
        </Row>
    )
}
