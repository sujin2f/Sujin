import React, { PropsWithChildren } from 'react'

import { FixedHeader } from 'src/frontend/scenes/layout/FixedHeader'
import { Banner } from 'src/frontend/scenes/layout/Banner'
import { Footer } from 'src/frontend/scenes/layout/Footer'
import { useGlobalState } from 'src/frontend/hooks/global'

export const Public = (props: PropsWithChildren<{}>): JSX.Element => {
    const { returnClasses, wrapperElement } = useGlobalState()

    return (
        <div ref={wrapperElement} className={`${returnClasses} wrapper`}>
            <header>
                <FixedHeader />
                <Banner />
            </header>

            <main>{props.children}</main>

            <footer className="footer">
                <Footer />
            </footer>
        </div>
    )
}
