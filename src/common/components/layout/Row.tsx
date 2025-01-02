import { PropsWithChildren, createElement } from 'react'
import { className } from 'src/common/utils/string'

require('src/common/scss/layout.scss')

type Props = {
    className?: string
    dom?: string | JSX.Element
    fullWidth?: boolean
}

export const Row = (props: PropsWithChildren<Props>): JSX.Element => {
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
