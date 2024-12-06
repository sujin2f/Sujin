import React, {
    PropsWithChildren,
    MouseEvent,
    useCallback,
    useState,
    Fragment,
} from 'react'

import { CloseButton } from 'src/common/components/forms/CloseButton'
import { Button } from 'src/common/components/forms/Button'
import { Overlay } from 'src/common/components/containers/Overlay'
import { MouseEventCallback } from 'src/common/types/react'

type Props = {
    closeModal?: MouseEventCallback
    hideCloseButton?: boolean
    className?: string
}

/*
 * Reveal Component in Foundation Site
 * @ref https://get.foundation/sites/docs/reveal.html
 */
export const Modal = (props: PropsWithChildren<Props>): JSX.Element => {
    const [opened, changeOpened] = useState<boolean>(true)

    const close = useCallback(
        (e?: MouseEvent) => {
            if (!props.closeModal) {
                changeOpened(false)
                return
            }
            props.closeModal()
        },
        [props],
    )

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
