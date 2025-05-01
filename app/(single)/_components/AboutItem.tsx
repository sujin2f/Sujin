import React from 'react'
/* Helpers */
import { removeExtraParagraph, replaceQuotes } from '@app/(single)/_lib/utils'
import type { T_ShortcodeAttrMatch } from '@app/_lib/types'
/* Assets */
import '@app/(single)/_components/about-item.scss'

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
