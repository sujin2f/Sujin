import React, { PropsWithChildren } from 'react'

require('src/frontend/scss/widget.scss')

export const WidgetTitle = (props: PropsWithChildren): JSX.Element => {
    return (
        <h2 className="widget__heading">
            <span>{props.children}</span>
        </h2>
    )
}
