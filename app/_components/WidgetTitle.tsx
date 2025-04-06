import React, { type PropsWithChildren } from 'react'

const WidgetTitle = (props: PropsWithChildren) => {
    return (
        <h2 className="widget__heading">
            <span>{props.children}</span>
        </h2>
    )
}
export default WidgetTitle
