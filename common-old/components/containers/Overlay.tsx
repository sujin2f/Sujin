import { useRef, useCallback, type MouseEventHandler, type MouseEvent, type PropsWithChildren } from 'react'
/* Helpers */
import { joinClassNames } from '@common/utils/string'

type Props = PropsWithChildren<{
    className?: string
    onClick?: MouseEventHandler<Element>
}>

/**
 * Overlay component that displays a semi-transparent overlay.
 *
 * @param {ReactNode} [props.children] - The content to display in the overlay.
 * @param {string} [props.className] - Additional class names for the overlay.
 * @param {CSSProperties} [props.style] - Inline styles for the overlay.
 * @param {MouseEventCallback} [props.onClick] - Callback function to handle click events.
 */
const Overlay = ({ children, className, onClick }: Props) => {
    const overlayRef = useRef<HTMLDivElement>(null)

    const close = useCallback(
        (e: MouseEvent) => {
            if (e.target !== overlayRef.current) return
            if (onClick) onClick(e)
        },
        [onClick],
    )

    return (
        <div
            className={joinClassNames('overlay', className)}
            ref={overlayRef}
            onClick={(e) => close(e)}
            data-testid="overlay"
        >
            {children}
        </div>
    )
}
export default Overlay
