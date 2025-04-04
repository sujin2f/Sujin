import React from 'react'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
/* Assets */
import LoadingImg from '@app/_lib/images/loading.svg'

export default async function Loading() {
    return (
        <>
            <Header />
            <Banner
                banner={{
                    title: <LoadingImg />,
                }}
            />
            <Footer />
        </>
    )
}
