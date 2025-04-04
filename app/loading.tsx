import React from 'react'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
/* Helpers */
import { getPathName, getMenuNameFromPath } from '@app/_lib/utils'
/* Assets */
import LoadingImg from '@app/_lib/images/loading.svg'

export default async function Loading() {
    const path = await getPathName()
    const menu = getMenuNameFromPath(path)
    return (
        <>
            <Header />
            <Banner
                menu={menu}
                banner={{
                    title: <LoadingImg />,
                }}
            />
            <Footer />
        </>
    )
}
