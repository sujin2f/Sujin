import React from 'react'
/* Components */
import Banner from '@components/header/Banner'
/* Helpers */
import { getPathName } from '@src/utils/server'
import { getMenuNameFromPath } from '@src/utils/system'
/* Assets */
import LoadingImg from '@src/images/loading.svg'

export default async function Loading() {
    const path = await getPathName()
    const menu = getMenuNameFromPath(path)
    return (
        <Banner
            menu={menu}
            banner={{
                title: <LoadingImg />,
            }}
        />
    )
}
