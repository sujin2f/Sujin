/*
 * Public Wrapper Component
 * scenes/public
 */

import React from 'react'

import { Footer, FixedHeader, Banner } from 'src/frontend/components'
import { useGlobalWrapper } from 'src/frontend/hooks'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactChildrenProps } from 'src/types'

export const Public = (props: ReactChildrenProps): JSX.Element => {
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
