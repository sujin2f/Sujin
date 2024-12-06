import React from 'react'
import { MouseEventCallback } from 'src/common/types/react'

type Props = {
    onClick?: MouseEventCallback
}

/*
 * Close Button Component in Foundation Site
 * @ref https://get.foundation/sites/docs/close-button.html
 */
export const CloseButton = (props: Props): JSX.Element => {
    return (
        <button
            className="close-button"
            aria-label="Close"
            onClick={props.onClick}
        >
            <span aria-hidden="true">&times;</span>
        </button>
    )
}
