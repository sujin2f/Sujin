import React, { PropsWithChildren } from 'react'

import { FixedHeader } from 'src/frontend/scenes/layout/FixedHeader'
import { Footer } from 'src/frontend/scenes/layout/Footer'
import { useGlobalState } from 'src/frontend/hooks/global'

export const Public = (props: PropsWithChildren<{}>): JSX.Element => {
    const { returnClasses, wrapperElement } = useGlobalState()

    return (
        <div ref={wrapperElement} className={`${returnClasses} wrapper`}>
            <FixedHeader />

            <main>{props.children}</main>

            <footer className="footer">
                <Footer />
            </footer>
        </div>
    )
}
