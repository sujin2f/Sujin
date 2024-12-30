import React, { PropsWithChildren } from 'react'
import { CloseButton } from 'src/common/components/forms/CloseButton'
import { MouseEventCallback } from 'src/common/types/react'
import { className } from 'src/common/utils/string'

type Props = {
    className?: string
    onClick?: MouseEventCallback
}

/*
 * Callout Component in Foundation Site
 * @ref https://get.foundation/sites/docs/callout.html
 */
export const Callout = (props: PropsWithChildren<Props>): JSX.Element => {
    const { onClick } = props

    return (
        <div className={className('callout', props.className)}>
            {props.children}
            {onClick && <CloseButton onClick={onClick} />}
        </div>
    )
}
