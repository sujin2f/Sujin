import React, { PropsWithChildren } from 'react'

import '@src/frontend/scss/widget.scss'

export function WidgetTitle(props: PropsWithChildren) {
    return (
        <h2 className="widget__heading">
            <span>{props.children}</span>
        </h2>
    )
}
