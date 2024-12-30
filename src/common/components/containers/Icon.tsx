import React from 'react'
import { className } from 'src/common/utils/string'

type Props = {
    icon: string
    className?: string
}

export const Icon = (props: Props): JSX.Element => {
    return <i className={className(`icon-${props.icon}`, props.className)} />
}
