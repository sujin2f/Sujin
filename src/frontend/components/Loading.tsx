/*
 * Loading Component
 * components/common/Loading
 */

import React from 'react'

import IMG_loading from 'src/assets/images/loading.svg'

export const Loading = (): JSX.Element => {
    return (
        <section>
            <img src={IMG_loading} alt="Loading" />
        </section>
    )
}
