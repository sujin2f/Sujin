import React, { PropsWithChildren } from 'react'

import { FixedHeader } from 'src/frontend/scenes/layout/FixedHeader'
import { Footer } from 'src/frontend/scenes/layout/Footer'
import { className as getClassName } from 'src/common/utils/string'
import { useGlobalState } from 'src/frontend/hooks/global'

require('src/frontend/scss/dev-tool.scss')

const DevTool = (props: PropsWithChildren): JSX.Element => {
    const { returnClasses, wrapperElement } = useGlobalState('devtool')
    const className = getClassName('wrapper', returnClasses)

    return (
        <div ref={wrapperElement} className={className}>
            <FixedHeader />
            <main>{props.children}</main>
            <Footer />
        </div>
    )
}

export default DevTool
