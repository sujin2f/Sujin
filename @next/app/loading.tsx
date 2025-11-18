import React from 'react'
/* Components */
import Wrapper from '@lib/components/Wrapper'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import LoadingImg from '@common/images/loading.svg'
import style from '@app/front-page.module.scss'

type Props = {
    readonly menu?: MENU_NAMES
}

export default async function Loading({ menu }: Props) {
    return (
        <Wrapper
            footer={false}
            menu={menu}
            title={<LoadingImg />}
            style={style}
        />
    )
}
