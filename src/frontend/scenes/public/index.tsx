import React, { PropsWithChildren } from 'react'
import { Footer, FixedHeader, Banner } from 'src/frontend/components/layout'
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

export { Archive } from './Archive'
export { FrontPage } from './FrontPage'
export { NotFound } from './NotFound'
export { Page } from './Page'
export { Post } from './Post'
