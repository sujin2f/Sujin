/* Utils */
import { replaceQuotes } from '@lib/utils/replaceQuotes'
import { removeEmptyParagraphs } from '@sujin/share/utils/string'
/* T_Types */
import type { T_ShortcodeAttrMatch } from '@sujin/lib/types'
/* Assets */
import './AboutItem.scss'

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
                    __html: removeEmptyParagraphs(content),
                }}
            ></div>
        </div>
    )
}
