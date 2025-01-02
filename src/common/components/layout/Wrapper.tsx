import React, { Fragment, PropsWithChildren } from 'react'
import { useFontLoader } from 'src/common/hooks/useFontLoader'

require('src/common/scss/normalize.css')
require('src/common/scss/base.scss')

export const Wrapper = (props: PropsWithChildren<{}>): JSX.Element => {
    useFontLoader('Ubuntu')

    return <Fragment>{props.children}</Fragment>
}
