import React, {
    PropsWithChildren,
    useCallback,
    useState,
    Fragment,
} from 'react'

import { CloseButton } from '../forms/CloseButton'
import Button from '../forms/Button'
import { Overlay } from '../containers/Overlay'
import { MouseEventCallback } from '../../types/react'

type Props = {
    closeModal?: MouseEventCallback
    hideCloseButton?: boolean
    className?: string
}

/*
 * Reveal Component in Foundation Site
 * @ref https://get.foundation/sites/docs/reveal.html
 */
export const Modal = (props: PropsWithChildren<Props>) => {
    const [opened, changeOpened] = useState<boolean>(true)

    const close = useCallback(() => {
        if (!props.closeModal) {
            changeOpened(false)
            return
        }
        props.closeModal()
    }, [props])

    if (!opened) {
        return <Fragment></Fragment>
    }

    return (
        <Overlay
            style={{ display: 'block' }}
            onClick={close}
            className={props.className}
        >
            <div className="reveal" style={{ display: 'block' }}>
                {props.children}

                {!props.hideCloseButton && (
                    <Button
                        className="secondary"
                        onClick={close}
                        title="Cancel"
                    />
                )}

                <CloseButton onClick={close} />
            </div>
        </Overlay>
    )
}
