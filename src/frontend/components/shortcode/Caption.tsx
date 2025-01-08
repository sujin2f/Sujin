import React from 'react'

import { className as getClassName } from '@common/utils/string'
import { AttrMatch } from '@project/types/wordpress'
import { replaceQuotes as getter } from '@frontend/utils/single'

import '@frontend/scss/caption.scss'

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

    return (
        <div
            className={`caption ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        ></div>
    )
}
