'use client'
import { type PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { CloseButton } from '../forms/CloseButton'
import Button from '../forms/Button'
import Overlay from '../containers/Overlay'
import { MouseEventCallback } from '../../types/react'
import { KeyCodes } from '../../constants/keycode'

type Props = {
    closeModal?: MouseEventCallback
    closeButton?: boolean
    className?: string
    show?: boolean
    esc?: boolean
}

const Modal = ({
    closeModal,
    className,
    closeButton,
    show: showProp = false,
    esc = true,
    children,
}: PropsWithChildren<Props>) => {
    const [show, changeShow] = useState<boolean>(showProp)

    const close = useCallback(() => {
        changeShow(showProp)
        if (closeModal) closeModal()
    }, [closeModal, showProp])

    // ESC to close
    const escClose = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === KeyCodes.ESC && show !== showProp) {
                close()
            }
        },
        [close, show, showProp],
    )

    useEffect(() => {
        const document = window.document
        if (esc) {
            document.addEventListener('keydown', escClose)
        }

        return () => {
            if (document) {
                document.removeEventListener('keydown', escClose)
            }
        }
    }, [esc, escClose])

    useEffect(() => {
        if (showProp) {
            changeShow(!showProp)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (show === showProp) {
        return null
    }

    return (
        <Overlay onClick={close} className={className}>
            <div className="modal --fit-content">
                {children}

                {closeButton && (
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

export default Modal
