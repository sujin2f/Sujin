import React, {
    useRef,
    MouseEvent,
    PropsWithChildren,
    CSSProperties,
} from 'react'

type Props = PropsWithChildren<{
    className?: string
    style?: CSSProperties
    onClick?: (e?: MouseEvent) => void
}>
export const Overlay = (props: Props): JSX.Element => {
    const overlayRef = useRef<HTMLDivElement>(null)
    const { className, style } = props

    const mayCloseComponent = (e: MouseEvent) => {
        if (e.target !== overlayRef.current) {
            return
        }
        if (props.onClick) {
            props.onClick()
        }
    }
    return (
        <div
            className={`reveal-overlay ${className}`}
            style={style}
            ref={overlayRef}
            onClick={(e) => mayCloseComponent(e)}
            data-testid="overlay"
        >
            {props.children}
        </div>
    )
}
