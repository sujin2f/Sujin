import React from 'react'

/* Helpers */
import { replaceQuotes } from '@app/(single)/_lib/utils'
import type { T_ShortcodeAttrMatch } from '@app/_lib/types'

interface Props {
    value: T_ShortcodeAttrMatch
}

/**
 * Caption component that renders an image with a caption.
 *
 * @param {T_ShortcodeAttrMatch} props.value - The value containing the attributes for the caption.
 */
export const Caption = ({ value: { named } }: Props) => {
    const content = replaceQuotes(named, 'innerContent')
    let image = content
    let text = ''
    const tags = content.match(/(<img[^>]*src="[^"]+"[^>]*>)(.+)/)
    if (tags && tags[2]) {
        image = tags[1]
        text = tags[2]
    }

    return (
        <figure className="image__container">
            <div
                className="caption__image"
                dangerouslySetInnerHTML={{ __html: image }}
            />
            {text && (
                <div className="caption">
                    <div
                        className="caption__text"
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                </div>
            )}
        </figure>
    )
}
