import React from 'react'
/* Components */
import Header from '@components/header'
import { default as FrontPageComponent } from '@components/FrontPage'
/* Assets */
import '@src/scss/front-page.scss'

export default async function FrontPage() {
    return (
        <>
            <Header />
            <FrontPageComponent />
        </>
    )
}
