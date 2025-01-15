import { PropsWithChildren, createElement } from 'react'
import { className } from '../../utils/string'

import '../../scss/layout.scss'

export type OneToTwelve = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type OneToEleven = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
type Props = {
    small?: OneToTwelve
    smallOffset?: OneToEleven
    medium?: OneToTwelve
    mediumOffset?: OneToEleven
    large?: OneToTwelve
    largeOffset?: OneToEleven
    larger?: OneToTwelve
    largerOffset?: OneToEleven
    className?: string
    id?: string
    dom?: string | React.ElementType
}

export const Column = (props: PropsWithChildren<Props>) => {
    const small = props.small && `small-${props.small}`
    const medium = props.medium && `medium-${props.medium}`
    const large = props.large && `large-${props.large}`
    const larger = props.large && `larger-${props.larger}`
    const smallOffset = props.smallOffset && `small-offset-${props.smallOffset}`
    const mediumOffset =
        props.mediumOffset && `medium-offset-${props.mediumOffset}`
    const largeOffset = props.largeOffset && `large-offset-${props.largeOffset}`
    const largerOffset =
        props.largerOffset && `larger-offset-${props.largerOffset}`

    const dom = props.dom || 'div'

    const Element = createElement(
        dom,
        {
            className: className(
                'column',
                props.className,
                small,
                medium,
                large,
                larger,
                smallOffset,
                mediumOffset,
                largeOffset,
                largerOffset,
            ),
            id: props.id,
        },
        props.children,
    )

    return Element
}
