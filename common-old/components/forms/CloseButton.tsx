import type { MouseEventHandler } from 'react'

type Props = {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export const CloseButton = (props: Props) => {
    return (
        <button className="button button--close" aria-label="Close" onClick={props.onClick}>
            <span aria-hidden="true">&times;</span>
        </button>
    )
}
