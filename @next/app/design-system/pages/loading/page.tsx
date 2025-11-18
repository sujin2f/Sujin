import React from 'react'
import Loading from '@app/loading'
import { MENU_NAMES } from '@sujin/lib/constants'

export default async function LoadingPage() {
    return <Loading menu={MENU_NAMES.DESIGN_SYSTEM} />
}
