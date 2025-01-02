import { PropsWithChildren, createElement } from 'react'
import { className } from 'src/common/utils/string'

require('src/common/scss/layout.scss')

type OneToTwelve = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type OneToEleven = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
type Props = {
    small?: OneToTwelve
    smallOffset?: OneToEleven
    medium?: OneToTwelve
    mediumOffset?: OneToEleven
    large?: OneToTwelve
    largeOffset?: OneToEleven
    className?: string
    id?: string
    dom?: string | JSX.Element
}

export const Column = (props: PropsWithChildren<Props>): JSX.Element => {
    const small = props.small && `small-${props.small}`
    const medium = props.medium && `medium-${props.medium}`
    const large = props.large && `large-${props.large}`
    const smallOffset = props.smallOffset && `small-offset-${props.smallOffset}`
    const mediumOffset =
        props.mediumOffset && `medium-offset-${props.mediumOffset}`
    const largeOffset = props.largeOffset && `large-offset-${props.largeOffset}`

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
                smallOffset,
                mediumOffset,
                largeOffset,
            ),
            id: props.id,
        },
        props.children,
    )

    return Element
}
