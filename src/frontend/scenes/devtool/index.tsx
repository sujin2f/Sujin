import React, { PropsWithChildren } from 'react'

import { FixedHeader } from '@src/frontend/scenes/layout/FixedHeader'
import { Footer } from '@src/frontend/scenes/layout/Footer'
import { className as getClassName } from '@src/common/utils/string'
import { useGlobalState } from '@src/frontend/hooks/useGlobalState'

import '@src/frontend/scss/dev-tool.scss'

export function DevTool(props: PropsWithChildren) {
    const { returnClasses, wrapperElement } = useGlobalState('devtool')
    const className = getClassName('wrapper', returnClasses)

    return (
        <div className={className} ref={wrapperElement}>
            <FixedHeader />

            <main>{props.children}</main>

            <Footer />
        </div>
    )
}
