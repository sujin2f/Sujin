import { JSX, PropsWithChildren, createElement } from 'react'
import { className } from '../../utils/string'

import '../../scss/layout.scss'

type Props = {
    readonly className?: string
    readonly dom?: string | JSX.ElementType
    readonly fullWidth?: boolean
}

export function Row(props: PropsWithChildren<Props>) {
    const { className: cls, dom, fullWidth } = props
    const type = dom || 'div'

    return createElement(
        type,
        {
            className: className('row', cls, fullWidth && 'row--full-width'),
        },
        props.children,
    )
}
