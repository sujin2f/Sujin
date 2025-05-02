import type { PropsWithChildren } from 'react'
/* Assets */
import '@app/_components/widget-title.scss'

export const WidgetTitle = (props: PropsWithChildren) => {
    return (
        <h2 className="widget__heading">
            <span>{props.children}</span>
        </h2>
    )
}
