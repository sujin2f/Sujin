/**
 * FrontPage Component
 *
 * @module frontend
 */

import React, { Fragment } from 'react'

import { useFrontPage } from 'src/frontend/hooks/useFrontPage'

export const FrontPage = (): JSX.Element => {
    useFrontPage()
    return <Fragment />
}
