import React from 'react'
import { filterEmpty } from 'src/common/utils/object'
import { MouseEventCallback } from 'src/common/types/react'
import { Icon } from 'src/common/components/containers/Icon'

type Props = {
    title?: string
    className?: string
    onClick?: MouseEventCallback
    autoFocus?: boolean
    icon?: string
    type?: 'button' | 'submit' | 'reset' | undefined
}

/*
 * Button Component in Foundation Site
 * @ref https://get.foundation/sites/docs/button.html
 */
export const Button = (props: Props): JSX.Element => {
    const { onClick, autoFocus, icon, type } = props

    const className = props.className || 'primary'
    const title = props.title

    const buttonProps = filterEmpty({
        className: `button ${className}`,
        onClick,
        autoFocus,
        'aria-label': title,
        type: type ? type : 'button',
    })

    return (
        <button {...buttonProps}>
            {icon && <Icon icon={icon}></Icon>}
            {title && title}
        </button>
    )
}
