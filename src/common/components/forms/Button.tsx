import React, { useCallback, useMemo, PropsWithChildren } from 'react'
import { filterEmpty } from 'src/common/utils/object'
import { className as getClassName } from 'src/common/utils/string'
import { MouseEventCallback } from 'src/common/types/react'
import { Icon } from 'src/common/components/containers/Icon'
import { useNavigate } from 'react-router-dom'

require('src/common/scss/form.scss')

type Props = {
    title?: string | number
    className?: string
    onClick?: MouseEventCallback
    autoFocus?: boolean
    icon?: boolean
    type?: 'button' | 'submit' | 'reset' | 'file'
    id?: string
    color?: 'primary' | 'secondary' | 'success' | 'alert' | 'warning'
    hollow?: boolean
    to?: string
}

export const Button = (props: PropsWithChildren<Props>): JSX.Element => {
    const { autoFocus, type, id, children } = props
    const navigate = useNavigate()

    const className = useMemo(() => {
        const color = props.color || 'primary'
        return getClassName(
            'button',
            props.className,
            !props.icon && `button--${color}`,
            props.hollow && 'button--hollow',
            props.icon && 'button--icon',
        )
    }, [props.className, props.color, props.hollow])

    const title = useMemo(() => props.title, [props.title])

    const onClick = useCallback(
        (e: React.MouseEvent) => {
            if (props.onClick) {
                props.onClick(e)
                e.preventDefault()
                return
            }

            if (props.to) {
                navigate(props.to)
            }
        },
        [navigate, props],
    )

    const buttonProps = useMemo(() => {
        return filterEmpty({
            className,
            onClick,
            autoFocus,
            'aria-label': title,
            type: type ? type : 'button',
            id,
        })
    }, [autoFocus, className, onClick, title, type, id])

    if (children) {
        return <button {...buttonProps}>{children}</button>
    }

    return <button {...buttonProps}>{title && title}</button>
}
