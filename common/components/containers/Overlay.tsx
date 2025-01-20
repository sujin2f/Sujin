import React, {
    useRef,
    MouseEvent,
    PropsWithChildren,
    CSSProperties,
    useCallback,
} from 'react'

/* Helpers */
import { MouseEventCallback } from '../../types/react'
import { joinClassNames } from '../../utils/string'

type Props = PropsWithChildren<{
    className?: string
    style?: CSSProperties
    onClick?: MouseEventCallback
}>

/**
 * Overlay component that displays a semi-transparent overlay.
 *
 * @param {ReactNode} [props.children] - The content to display in the overlay.
 * @param {string} [props.className] - Additional class names for the overlay.
 * @param {CSSProperties} [props.style] - Inline styles for the overlay.
 * @param {MouseEventCallback} [props.onClick] - Callback function to handle click events.
 * @returns {JSX.Element} The rendered Overlay component.
 * @see https://get.foundation/sites/docs/reveal.html
 */
export const Overlay = ({ children, className, style, onClick }: Props) => {
    const overlayRef = useRef<HTMLDivElement>(null)

    const close = useCallback(
        (e: MouseEvent) => {
            if (e.target !== overlayRef.current || !onClick) {
                return
            }
            onClick()
        },
        [onClick],
    )

    return (
        <div
            className={joinClassNames('reveal-overlay', className)}
            style={style}
            ref={overlayRef}
            onClick={(e) => close(e)}
            data-testid="overlay"
        >
            {children}
        </div>
    )
}
