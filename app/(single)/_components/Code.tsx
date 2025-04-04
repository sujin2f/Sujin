import React from 'react'
/* Components */
import { Code as CodeComponent } from '@common/components/containers/Code'
/* Helpers */
import { replaceQuotes } from '@app/(single)/utils'
import { languages } from '@common/constants/helper'
import type { AttrMatch } from '@app/_lib/types/wordpress'

interface Props {
    value: AttrMatch
}

export const Code = (props: Props) => {
    const {
        value: { named },
    } = props
    const lang = replaceQuotes(named, 'lang') as (typeof languages)[number]
    const content = replaceQuotes(named, 'innerContent')

    return (
        <CodeComponent lang={lang}>
            {content.replace(/<br \/>/gi, '')}
        </CodeComponent>
    )
}
