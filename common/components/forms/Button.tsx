import React, { useCallback, useMemo, PropsWithChildren } from 'react'
// import { useNavigate } from 'react-router-dom'

import { filterEmpty } from '../../utils/object'
import { className as getClassName } from '../../utils/string'
import { MouseEventCallback } from '../../types/react'

import '../../scss/form.scss'

type Props = {
    title?: string | number
    className?: string
    onClick?: MouseEventCallback
    type?: 'button' | 'submit' | 'reset' | 'file'
    id?: string
    color?: 'primary' | 'secondary' | 'success' | 'alert' | 'warning'
    hollow?: boolean
    vanilla?: boolean
    to?: string
}

export const Button = (props: PropsWithChildren<Props>) => {
    const { type, id, children } = props
    // const navigate = useNavigate()

    const className = useMemo(() => {
        const color = props.color || 'primary'
        return getClassName(
            'button',
            props.className,
            `button--${color}`,
            props.hollow && 'button--hollow',
            props.vanilla && 'button--vanilla',
        )
    }, [props.className, props.color, props.hollow, props.vanilla])

    const title = useMemo(() => props.title, [props.title])

    const onClick = useCallback(
        (e: React.MouseEvent) => {
            // if (props.onClick) {
            //     props.onClick(e)
            //     e.preventDefault()
            //     return
            // }
            // if (props.to) {
            //     navigate(props.to)
            // }
        },
        // [navigate, props],
        [],
    )

    const buttonProps = useMemo(() => {
        return filterEmpty({
            className,
            onClick,
            'aria-label': title,
            type: type ? type : 'button',
            id,
        })
    }, [className, onClick, title, type, id])

    if (children) {
        return <button {...buttonProps}>{children}</button>
    }

    return <button {...buttonProps}>{title && title}</button>
}
