import React from 'react'

import { className as getClassName } from '@common/utils/string'
import { AttrMatch } from '@src/types/wordpress'
import { replaceQuotes as getter } from '@src/utils/single'

interface Props {
    value: AttrMatch
}

export const Caption = (props: Props) => {
    const {
        value: { named },
    } = props

    const align = getter(named, 'align')
    const content = getter(named, 'innerContent')
    const className = getClassName(
        'caption',
        align === 'aligncenter' && 'caption--align-center',
    )
    let image = content
    let text = ''
    const tags = content.match(/(<img[^>]*src="[^"]+"[^>]*>)(.+)/)
    if (tags && tags[2]) {
        image = tags[1]
        text = tags[2]
    }

    return (
        <div className={className}>
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
