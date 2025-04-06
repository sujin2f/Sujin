import React from 'react'

/* Helpers */
import type { AttrMatch } from '@app/_lib/data/mysql/types'
import { joinClassNames } from '@common/utils/string'
import { replaceQuotes } from '@app/(single)/utils'

interface Props {
    value: AttrMatch
}

/**
 * Caption component that renders an image with a caption.
 *
 * @param {AttrMatch} props.value - The value containing the attributes for the caption.
 */
export const Caption = ({ value: { named } }: Props) => {
    const align = replaceQuotes(named, 'align')
    const content = replaceQuotes(named, 'innerContent')
    let image = content
    let text = ''
    const tags = content.match(/(<img[^>]*src="[^"]+"[^>]*>)(.+)/)
    if (tags && tags[2]) {
        image = tags[1]
        text = tags[2]
    }

    return (
        <div
            className={joinClassNames(
                'caption',
                align === 'aligncenter' && 'caption--align-center',
            )}
        >
            <div
                className="caption__image"
                dangerouslySetInnerHTML={{ __html: image }}
            />
            {text && (
                <div
                    className="caption__text"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            )}
        </div>
    )
}
