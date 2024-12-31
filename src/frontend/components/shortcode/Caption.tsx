import React from 'react'

import { className as getClassName } from 'src/common/utils/string'
import { AttrMatch } from 'src/types/wordpress'
import { replaceQuotes as getter } from 'src/frontend/utils/single'

require('src/frontend/scss/caption.scss')

interface Props {
    value: AttrMatch
}

export const Caption = (props: Props): JSX.Element => {
    const {
        value: { named },
    } = props

    const align = getter(named, 'align')
    const content = getter(named, 'innerContent')
    const className = getClassName(
        'caption',
        align === 'aligncenter' && 'caption--align-center',
    )

    return (
        <div
            className={`caption ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        ></div>
    )
}
