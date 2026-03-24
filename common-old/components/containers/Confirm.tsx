'use client'
import { type PropsWithChildren, useCallback, useEffect } from 'react'

import Button from '../forms/Button'
import Overlay from './Overlay'
import { KeyCodes } from '@common/constants/keycode'
import { QuantumBool } from '@common/types'
import ButtonGroup from '../forms/ButtonGroup'

type Props = {
    callback: (value: QuantumBool) => void
    value: QuantumBool
    className?: string
}

const Confirm = ({ callback, value = QuantumBool.FALSE, className, children }: PropsWithChildren<Props>) => {
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === KeyCodes.ESC) {
                callback(QuantumBool.FALSE)
                return
            }
            if (e.key === KeyCodes.ENTER) {
                callback(QuantumBool.TRUE)
                return
            }
        },
        [callback],
    )

    useEffect(() => {
        const document = window.document
        document.addEventListener('keydown', onKeyDown)

        return () => {
            if (document) {
                document.removeEventListener('keydown', onKeyDown)
            }
        }
    }, [onKeyDown])

    if (value !== QuantumBool.MOD) {
        return null
    }

    return (
        <Overlay onClick={close} className={className}>
            <div className="confirm --fit-content">
                {children}

                <ButtonGroup className="--center --gap--top">
                    <Button hollow onClick={() => callback(QuantumBool.FALSE)} title="Cancel" />
                    <Button onClick={() => callback(QuantumBool.TRUE)} title="Confirm" />
                </ButtonGroup>
            </div>
        </Overlay>
    )
}

export default Confirm
