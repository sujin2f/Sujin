import React from 'react'

import { FixedHeader } from '@frontend/scenes/layout/FixedHeader'
import { Banner } from '@frontend/scenes/layout/Banner'

import { useFrontPage } from '@frontend/hooks/useFrontPage'
import { useGlobalState } from '@frontend/hooks/useGlobalState'

import Logo from '@frontend/images/logo.svg'

import 'src/frontend/scss/front-page.scss'

function FrontPage() {
    const background = useFrontPage()
    const { returnClasses, wrapperElement } = useGlobalState('front-page')

    return (
        <div className={`${returnClasses} wrapper`} ref={wrapperElement}>
            <FixedHeader />

            <main>
                <Banner
                    background={background}
                    excerpt={window.sujin.EXCERPT}
                    title={
                        <Logo
                            aria-label={window.sujin.SITE_NAME}
                            className="banner__logo"
                        />
                    }
                />
            </main>
        </div>
    )
}

export default FrontPage
