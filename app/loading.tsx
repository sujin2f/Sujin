import React from 'react'

import { Banner } from '@components/header/Banner'

import LoadingImg from '@src/images/loading.svg'

type Props = {
    menu: string
}

export default function Loading({ menu }: Props) {
    return (
        <Banner
            menu={menu}
            banner={{
                title: <LoadingImg />,
            }}
        />
    )
}
