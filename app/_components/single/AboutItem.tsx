import React from 'react'
/* Helpers */
import { replaceQuotes, removeExtraParagraph } from '@app/(single)/utils'
import type { T_ShortcodeAttrMatch } from '@app/_lib/types'

interface Props {
    value: T_ShortcodeAttrMatch
}

export const AboutItem = (props: Props) => {
    const {
        value: { named },
    } = props

    const from = replaceQuotes(named, 'from')
    const to = replaceQuotes(named, 'to')
    const content = replaceQuotes(named, 'innerContent')

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
