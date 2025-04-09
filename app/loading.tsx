import React from 'react'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Header } from '@app/_components/header'
/* Assets */
import LoadingImg from '@app/_lib/images/loading.svg'
import './front-page.scss'

export default async function Loading() {
    return (
        <>
            <Header />
            <Banner title={<LoadingImg />} />
            <main className="page--frontpage">
                <Banner title={<LoadingImg />} />
            </main>
        </>
    )
}
