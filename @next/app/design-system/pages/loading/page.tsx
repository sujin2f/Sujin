import React from 'react'
import Loading from '@app/loading'
import { MENU_NAMES } from '@app/_lib/types'

export default async function Page() {
    return <Loading menu={MENU_NAMES.DESIGN_SYSTEM} />
}
