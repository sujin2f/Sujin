/*
 * Public Wrapper Component
 * scenes/public
 */

import React from 'react'

import { GlobalFooter } from 'src/frontend/components/layout/GlobalFooter'
import { FixedHeader } from 'src/frontend/components/layout/GlobalHeader/FixedHeader'
import { TopHeader } from 'src/frontend/components/layout/GlobalHeader/TopHeader'
import { useGlobalWrapper } from 'src/frontend/hooks/global'
import { ReactChildrenProps } from 'src/types'

import 'src/assets/styles/style.scss'

export const Public = (props: ReactChildrenProps): JSX.Element => {
    const [className, wrapperElement] = useGlobalWrapper()

    return (
        <div ref={wrapperElement} className={className}>
            <header itemType="http://schema.org/WPHeader">
                <FixedHeader />
                <TopHeader />
            </header>

            <main className="row">{props.children}</main>

            <footer itemType="https://schema.org/WPFooter">
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
