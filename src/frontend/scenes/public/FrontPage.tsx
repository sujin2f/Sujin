/*
 * FrontPage Component
 * scenes/public/FrontPage
 */

import React, { Fragment } from 'react'

/*
import Post from 'scenes/public/Post';
import Page from 'scenes/public/Page';
*/

import { useBackground, useFrontPage } from 'src/frontend/store/hooks/global'

export const FrontPage = (): JSX.Element => {
    useBackground()
    useFrontPage()

    // TODO
    const frontPage = 'front-page'
    // const showOnFront = 'page'
    // const { frontPage, showOnFront } = { 'front-page', 'page' }

    if (frontPage === 'front-page') {
        return <Fragment />
    }

    // if (showOnFront === 'post') {
    //     return <div className="stretched-background hide-footer">posts</div>
    // }

    // if (showOnFront === 'page') {
    //     return <div className="stretched-background hide-footer">page</div>
    // }

    return <Fragment />
}
