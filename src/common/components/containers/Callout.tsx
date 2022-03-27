import React, { Fragment, MouseEvent } from 'react'
import { Column } from '../layout/Column'
import { Row } from '../layout/Row'
import { CloseButton } from '../forms/CloseButton'

type Props = {
    message?: string
    onClick?: (e?: MouseEvent) => void
}
export const Callout = (props: Props): JSX.Element => {
    const { message, onClick } = props

    if (!message) {
        return <Fragment />
    }

    return (
        <Row className="callout__wrapper">
            <Column>
                <div className="callout alert">
                    <p>{message}</p>
                    <CloseButton onClick={onClick} />
                </div>
            </Column>
        </Row>
    )
}
