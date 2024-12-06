import React, { Fragment } from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { CloseButton } from 'src/common/components/forms/CloseButton'
import { MouseEventCallback } from 'src/common/types/react'

type Props = {
    message?: string
    onClick?: MouseEventCallback
}

/*
 * Callout Component in Foundation Site
 * @ref https://get.foundation/sites/docs/callout.html
 */
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
