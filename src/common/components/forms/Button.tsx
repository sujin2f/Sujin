import React, { MouseEvent } from 'react'
import { removeEmpty } from '../../utils/object'

type Props = {
    title?: string
    className?: string
    onClick?: (e?: MouseEvent) => void
    autoFocus?: boolean
    icon?: string
    type?: 'button' | 'submit' | 'reset' | undefined
}

export const Button = (props: Props): JSX.Element => {
    const { onClick, autoFocus, icon, type } = props

    const className = props.className || 'primary'
    const title = props.title || 'Submit'

    const buttonProps = removeEmpty({
        className: `button ${className}`,
        onClick,
        autoFocus,
        'aria-label': title,
        type: type ? type : 'button',
    })

    return (
        <button {...buttonProps}>
            {icon && <i className={`fi-${icon}`} />}
            {!icon && title}
        </button>
    )
}
