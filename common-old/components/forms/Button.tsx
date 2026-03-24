'use client'
import { useCallback, useMemo, type MouseEventHandler, type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react'
import { redirect } from 'next/navigation'
/* Utils */
import { filterEmpty } from '@common/utils/object'
import { joinClassNames } from '@common/utils/string'

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    readonly color?: 'primary' | 'secondary' | 'success' | 'alert' | 'warning'
    readonly hollow?: boolean
    readonly vanilla?: boolean
    readonly href?: string
}

/**
 * Button component that renders a button with various styles and behaviors.
 *
 * @param {'button' | 'submit' | 'reset' | 'file'} [props.type] - The type of the button.
 * @param {'primary' | 'secondary' | 'success' | 'alert' | 'warning'} [props.color] - The color style of the button.
 * @param {boolean} [props.hollow] - Whether the button should have a hollow style.
 * @param {boolean} [props.vanilla] - Whether the button should have a vanilla style.
 * @param {string} [props.href] - The URL to redirect to when the button is clicked.
 * @deprecated
 */
const Button = ({
    title = 'Button',
    className,
    onClick: onClickProp,
    color,
    hollow,
    vanilla,
    href,
    children,
    ...props
}: Props) => {
    const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (e) => {
            if (onClickProp) {
                onClickProp(e)
                return
            }
            if (href) {
                redirect(href)
            }
        },
        [onClickProp, href],
    )

    const buttonProps = useMemo(() => {
        return filterEmpty({
            className: joinClassNames(
                className,
                'button',
                `button--${color || 'primary'}`,
                hollow && 'button--hollow',
                vanilla && 'button--vanilla',
            ),
            onClick,
            'aria-label': title,
        })
    }, [className, color, hollow, vanilla, onClick, title])

    if (children) {
        return (
            <button {...buttonProps} {...props}>
                {children}
            </button>
        )
    }

    return (
        <button {...buttonProps} {...props}>
            {title}
        </button>
    )
}

export default Button
