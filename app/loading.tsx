import React from 'react'
/* Components */
import Wrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import LoadingImg from '@app/_lib/images/loading.svg'
import '@app/front-page.scss'

type Props = {
    readonly menu?: MENU_NAMES
}

export default async function Loading({ menu }: Props) {
    return (
        <Wrapper
            footer={false}
            menu={menu}
            className="sujin wrapper--loading"
            title={<LoadingImg />}
        />
    )
}
