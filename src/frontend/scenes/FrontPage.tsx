import React from 'react'

import { FixedHeader } from 'src/frontend/scenes/layout/FixedHeader'
import { Banner } from 'src/frontend/scenes/layout/Banner'

import { useFrontPage } from 'src/frontend/hooks/useFrontPage'
import { useGlobalState } from 'src/frontend/hooks/useGlobalState'

import Logo from 'src/frontend/images/logo.svg'

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
