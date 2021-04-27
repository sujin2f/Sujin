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
import { GlobalVariable } from 'src/frontend/store/items/global-variable'

export const FrontPage = (): JSX.Element => {
    useBackground()
    useFrontPage()

    const globalVars = GlobalVariable.getInstance(window.sujin)

    const { frontPage, showOnFront } = globalVars

    if (frontPage === 'front-page') {
        return <Fragment />
    }

    if (showOnFront === 'post') {
        return <div className="stretched-background hide-footer">posts</div>
    }

    if (showOnFront === 'page') {
        return <div className="stretched-background hide-footer">page</div>
    }

    return <Fragment />
}
