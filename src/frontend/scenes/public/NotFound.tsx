/*
 * NotFound Scene
 * scenes/public/NotFound
 */

import React, { Fragment } from 'react'

import { use404 } from 'src/frontend/hooks/use404'

export const NotFound = (): JSX.Element => {
    const { title } = use404()
    document.title = title || ''
    return <Fragment />
}
