import React, { Fragment, PropsWithChildren } from 'react'
import { useFontLoader } from '@common/hooks/useFontLoader'

import '@common/scss/normalize.css'
import '@common/scss/base.scss'

export function Wrapper(props: PropsWithChildren) {
    useFontLoader('Ubuntu')

    return <Fragment>{props.children}</Fragment>
}
