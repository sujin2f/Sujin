import React, { PropsWithChildren } from 'react'

import '@src/scss/widget.scss'

export const WidgetTitle = (props: PropsWithChildren) => {
    return (
        <h2 className="widget__heading">
            <span>{props.children}</span>
        </h2>
    )
}
