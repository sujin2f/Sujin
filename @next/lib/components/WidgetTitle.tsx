import type { PropsWithChildren } from 'react'
/* Assets */
import './WidgetTitle.scss'

export const WidgetTitle = (props: PropsWithChildren) => {
    return (
        <h2 className="widget__heading">
            <span>{props.children}</span>
        </h2>
    )
}
