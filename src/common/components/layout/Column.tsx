import { PropsWithChildren, createElement } from 'react'

type Props = {
    small?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    smallOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    medium?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    mediumOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    large?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    largeOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    className?: string
    dom?: string
}
export const Column = (props: PropsWithChildren<Props>): JSX.Element => {
    const small = props.small ? `small-${props.small}` : ''
    const medium = props.medium ? `medium-${props.medium}` : ''
    const large = props.large ? `large-${props.large}` : ''
    const smallOffset = props.smallOffset
        ? `small-offset-${props.smallOffset}`
        : ''
    const mediumOffset = props.mediumOffset
        ? `medium-offset-${props.mediumOffset}`
        : ''
    const largeOffset = props.largeOffset
        ? `large-offset-${props.largeOffset}`
        : ''
    const className = props.className || ''
    const join =
        [small, medium, large, smallOffset, mediumOffset, largeOffset]
            .filter((v) => v)
            .join(' ')
            .trim() || 'small-12'
    const type = props.dom || 'div'

    const Element = createElement(
        type,
        {
            className: `columns ${join} ${className}`,
        },
        props.children,
    )

    return Element
}
