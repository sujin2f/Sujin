import React from 'react'
/* Components */
import { Code as CodeComponent } from '@common/components/containers/Code'
/* Helpers */
import { replaceQuotes } from '@app/(single)/_lib/replaceQuotes'
import { languages } from '@common/constants/helper'
import type { T_ShortcodeAttrMatch } from '@app/_lib/types'

interface Props {
    value: T_ShortcodeAttrMatch
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
