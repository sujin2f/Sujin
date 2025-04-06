'use client'
import React, { useCallback, useMemo, PropsWithChildren } from 'react'
import { redirect } from 'next/navigation'

/* Helpers */
import { filterEmpty } from '../../utils/object'
import { joinClassNames } from '../../utils/string'
import type { MouseEventCallback } from '../../types/react'
/* Assets */
import '../../scss/form.scss'

type Props = PropsWithChildren<{
    readonly title?: string | number
    readonly className?: string
    readonly onClick?: MouseEventCallback
    readonly type?: 'button' | 'submit' | 'reset' | 'file'
    readonly id?: string
    readonly color?: 'primary' | 'secondary' | 'success' | 'alert' | 'warning'
    readonly hollow?: boolean
    readonly vanilla?: boolean
    readonly href?: string
}>

/**
 * Button component that renders a button with various styles and behaviors.
 *
 * @param {ReactNode} props.children - The content to display in the button.
 * @param {string | number} [props.title] - The title or label of the button.
 * @param {string} [props.className] - Additional class names for the button.
 * @param {MouseEventCallback} [props.onClick] - Callback function to handle click events.
 * @param {'button' | 'submit' | 'reset' | 'file'} [props.type] - The type of the button.
 * @param {string} [props.id] - The id of the button.
 * @param {'primary' | 'secondary' | 'success' | 'alert' | 'warning'} [props.color] - The color style of the button.
 * @param {boolean} [props.hollow] - Whether the button should have a hollow style.
 * @param {boolean} [props.vanilla] - Whether the button should have a vanilla style.
 * @param {string} [props.href] - The URL to redirect to when the button is clicked.
 */
export const Button = ({
    title,
    className,
    onClick: cbClick,
    type,
    id,
    color,
    hollow,
    vanilla,
    href,
    children,
}: Props) => {
    const onClick = useCallback(
        (e: React.MouseEvent) => {
            if (cbClick) {
                cbClick(e)
                e.preventDefault()
                return
            }
            if (href) {
                redirect(href)
            }
        },
        [cbClick, href],
    )

    const buttonProps = useMemo(() => {
        return filterEmpty({
            className: joinClassNames(
                'button',
                className,
                `button--${color || 'primary'}`,
                hollow && 'button--hollow',
                vanilla && 'button--vanilla',
            ),
            onClick,
            'aria-label': title,
            type: type ? type : 'button',
            id,
        })
    }, [className, color, hollow, vanilla, onClick, title, type, id])

    if (children) {
        return <button {...buttonProps}>{children}</button>
    }

    return <button {...buttonProps}>{title || ''}</button>
}
