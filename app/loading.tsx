import React from 'react'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Header } from '@app/_components/header'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import LoadingImg from '@app/_lib/images/loading.svg'
import './front-page.scss'

type Props = {
    readonly menu?: MENU_NAMES
}

export default async function Loading({ menu }: Props) {
    return (
        <>
            <Header menu={menu} />
            <main className="page--frontpage">
                <Banner menu={menu} title={<LoadingImg />} />
            </main>
        </>
    )
}
