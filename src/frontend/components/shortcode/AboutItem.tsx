import React from 'react'

import { AttrMatch } from 'src/types/wordpress'
import {
    replaceQuotes as getter,
    removeExtraParagraph,
} from 'src/frontend/utils/single'

import 'src/frontend/scss/about-item.scss'

interface Props {
    value: AttrMatch
}

export const AboutItem = (props: Props) => {
    const {
        value: { named },
    } = props

    const from = getter(named, 'from')
    const to = getter(named, 'to')
    const content = getter(named, 'innerContent')

    return (
        <div className="about-item">
            <div className="about-item__year">
                <div>{from}</div>
                <div className="about-item__separator"></div>
                <div>{to}</div>
            </div>
            <div
                className="about-item__detail"
                dangerouslySetInnerHTML={{
                    __html: removeExtraParagraph(content),
                }}
            ></div>
        </div>
    )
}
