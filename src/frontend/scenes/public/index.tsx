import React, { PropsWithChildren } from 'react'

import { Footer, FixedHeader, Banner } from 'src/frontend/components'
import { useGlobalWrapper } from 'src/frontend/hooks'

export const Public = (props: PropsWithChildren<{}>): JSX.Element => {
    const [className, wrapperElement] = useGlobalWrapper()

    return (
        <div ref={wrapperElement} className={`${className} wrapper`}>
            <header>
                <FixedHeader />
                <Banner />
            </header>

            <main className="row">{props.children}</main>

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
