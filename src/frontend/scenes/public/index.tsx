import React, { PropsWithChildren } from 'react'

import { FixedHeader } from '@frontend/scenes/layout/FixedHeader'
import { Footer } from '@frontend/scenes/layout/Footer'
import { className as getClassName } from '@common/utils/string'
import { useGlobalState } from '@frontend/hooks/useGlobalState'

export function Public(props: PropsWithChildren) {
    const { returnClasses, wrapperElement } = useGlobalState()
    const className = getClassName('wrapper', returnClasses)

    return (
        <div className={className} ref={wrapperElement}>
            <FixedHeader />

            <main>{props.children}</main>

            <Footer />
        </div>
    )
}
