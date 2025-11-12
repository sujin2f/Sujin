import React from 'react'
import { MENU_NAMES } from '@app/_lib/types'
import NotFound from '@app/not-found'

export default async function Page() {
    return <NotFound menu={MENU_NAMES.DESIGN_SYSTEM} />
}
