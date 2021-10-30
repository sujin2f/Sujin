/*
 * Public Wrapper Component
 * scenes/public
 */

import React from 'react'

import { GlobalFooter, FixedHeader, TopHeader } from 'src/frontend/components'
import { useGlobalWrapper } from 'src/frontend/hooks'
import { ReactChildrenProps } from 'src/types'

import 'src/assets/styles/style.scss'

export const Public = (props: ReactChildrenProps): JSX.Element => {
    const [className, wrapperElement] = useGlobalWrapper()

    return (
        <div ref={wrapperElement} className={className}>
            <header>
                <FixedHeader />
                <TopHeader />
            </header>

            <main className="row">{props.children}</main>

            <footer>
                <GlobalFooter />
            </footer>
        </div>
    )
}

export { Archive } from './Archive'
export { FrontPage } from './FrontPage'
export { NotFound } from './NotFound'
export { Page } from './Page'
export { Post } from './Post'
