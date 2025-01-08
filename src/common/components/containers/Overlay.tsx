import React, {
    useRef,
    MouseEvent,
    PropsWithChildren,
    CSSProperties,
    useCallback,
} from 'react'
import { MouseEventCallback } from '@src/common/types/react'
import { className } from '@src/common/utils/string'

type Props = PropsWithChildren<{
    className?: string
    style?: CSSProperties
    onClick?: MouseEventCallback
}>

/*
 * Overlay Component in Foundation Site
 * @ref https://get.foundation/sites/docs/reveal.html
 */
export const Overlay = (props: Props) => {
    const overlayRef = useRef<HTMLDivElement>(null)
    const { style } = props

    const close = useCallback(
        (e: MouseEvent) => {
            if (e.target !== overlayRef.current || !props.onClick) {
                return
            }
            props.onClick()
        },
        [props],
    )

    return (
        <div
            className={className('reveal-overlay', props.className)}
            style={style}
            ref={overlayRef}
            onClick={(e) => close(e)}
            data-testid="overlay"
        >
            {props.children}
        </div>
    )
}
