/**
 * FrontPage Component
 *
 * @module frontend
 */

import React, { Fragment } from 'react'

import {
    useBackground,
    useFrontPage,
} from 'src/frontend/store/hooks/front-page'

export const FrontPage = (): JSX.Element => {
    useBackground()
    useFrontPage()
    return <Fragment />
}
