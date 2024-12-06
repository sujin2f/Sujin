import React from 'react'

type Props = {
    icon: string
    className?: string
}

/*
 * Foundation Icon in Foundation Site
 * @ref https://zurb.com/playground/foundation-icon-fonts-3
 */
export const Icon = (props: Props): JSX.Element => {
    return <i className={`fi-${props.icon} ${props.className}`} />
}
