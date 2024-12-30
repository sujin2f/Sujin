import React, { Fragment } from 'react'

import { FixedHeader } from 'src/frontend/scenes/layout/FixedHeader'
import { Banner } from 'src/frontend/scenes/layout/Banner'

import { useFrontPage } from 'src/frontend/hooks/useFrontPage'
import { useGlobalState } from 'src/frontend/hooks/global'

import Logo from 'src/frontend/images/logo.svg'

require('src/frontend/scss/front-page.scss')

const FrontPage = (): JSX.Element => {
    const { title, excerpt, background } = useFrontPage()
    const { returnClasses, wrapperElement } = useGlobalState()
    document.title = title || ''

    const titleBlock = (
        <Fragment>
            <Logo aria-label={title} />
        </Fragment>
    )

    return (
        <div ref={wrapperElement} className={`${returnClasses} wrapper`}>
            <FixedHeader />
            <main>
                <Banner
                    title={titleBlock}
                    excerpt={excerpt}
                    background={background}
                />
            </main>
        </div>
    )
}

export default FrontPage
