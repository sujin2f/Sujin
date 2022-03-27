import React, { MouseEvent } from 'react'

type Props = {
    onClick?: (e?: MouseEvent) => void
}

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
