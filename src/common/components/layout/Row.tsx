import { PropsWithChildren, createElement } from 'react'

type Props = {
    className?: string
    dom?: string
}
export const Row = (props: PropsWithChildren<Props>): JSX.Element => {
    const { className } = props
    const type = props.dom || 'div'
    const Element = createElement(
        type,
        {
            className: `row ${className || ''}`,
        },
        props.children,
    )

    return Element
}
