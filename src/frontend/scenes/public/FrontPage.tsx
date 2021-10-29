/**
 * FrontPage Component
 *
 * @module frontend
 */

import React, { Fragment } from 'react'

import { useBackground, useFrontPage } from 'src/frontend/hooks/front-page'

export const FrontPage = (): JSX.Element => {
    useBackground()
    useFrontPage()
    return <Fragment />
}
