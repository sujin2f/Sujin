import React from 'react'

import { AttrMatch } from '@src/types/wordpress'
import { replaceQuotes as getter } from '@src/utils/single'
import { Code as CodeComponent } from '@common/components/containers/Code'
import { languages } from '@common/constants/helper'

interface Props {
    value: AttrMatch
}

export const Code = (props: Props) => {
    const {
        value: { named },
    } = props
    const lang = getter(named, 'lang') as (typeof languages)[number]
    const content = getter(named, 'innerContent')

    return (
        <CodeComponent lang={lang}>
            {content.replace(/<br \/>/gi, '')}
        </CodeComponent>
    )
}
