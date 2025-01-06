import React from 'react'

import { AttrMatch } from 'src/types/wordpress'
import { replaceQuotes as getter } from 'src/frontend/utils/single'

import 'src/frontend/scss/code.scss'

interface Props {
    value: AttrMatch
}

export const Code = (props: Props) => {
    const {
        value: { named },
    } = props
    const lang = getter(named, 'lang')
    const content = getter(named, 'innerContent')

    return <code data-lang={lang}>{content}</code>
}
