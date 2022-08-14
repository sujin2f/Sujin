import React from 'react'

type Props = {
    icon: string
    className?: string
}
export const Icon = (props: Props): JSX.Element => {
    return <i className={`fi-${props.icon} ${props.className}`} />
}
