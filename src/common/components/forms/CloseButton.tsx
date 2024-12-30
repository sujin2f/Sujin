import React from 'react'
import { MouseEventCallback } from 'src/common/types/react'

type Props = {
    onClick?: MouseEventCallback
}

export const CloseButton = (props: Props): JSX.Element => {
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
