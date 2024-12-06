import { PropsWithChildren, createElement } from 'react'

type Props = {
    className?: string
    dom?: string
    expanded?: boolean
}

/*
 * Grid Layout Component in Foundation Site
 * @ref https://get.foundation/sites/docs/flex-grid.html
 */
export const Row = (props: PropsWithChildren<Props>): JSX.Element => {
    const type = props.dom || 'div'
    const className = [
        'row',
        props.className || '',
        props.expanded && 'expanded',
    ].filter((v) => v)

    return createElement(
        type,
        { className: className.join(' ') },
        props.children,
    )
}
