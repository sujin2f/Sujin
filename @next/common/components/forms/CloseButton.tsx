import React from 'react'
import { MouseEventCallback } from '../../types/react'

type Props = {
    onClick?: MouseEventCallback
}

export const CloseButton = (props: Props) => {
    return (
        <button
            className="button button--close"
            aria-label="Close"
            onClick={props.onClick}
        >
            <span aria-hidden="true">&times;</span>
        </button>
    )
}
