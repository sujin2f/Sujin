/*
 * Public Wrapper Component
 * scenes/public
 */

import React from 'react'

import { GlobalFooter } from 'src/frontend/components/layout/GlobalFooter'
import { FixedHeader } from 'src/frontend/components/layout/GlobalHeader/FixedHeader'
import { TopHeader } from 'src/frontend/components/layout/GlobalHeader/TopHeader'
import { useGlobalWrapper } from 'src/frontend/store/hooks/global'
import { ReactChildrenProps } from 'src/types/common'

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
