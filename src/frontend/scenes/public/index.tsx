import React, { PropsWithChildren } from 'react'
import { Banner } from 'src/frontend/components/layout/Banner'
import { FixedHeader } from 'src/frontend/components/layout/FixedHeader'
import { Footer } from 'src/frontend/components/layout/Footer'
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
