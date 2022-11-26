import React, { Fragment } from 'react'

import { useFrontPage } from 'src/frontend/hooks/useFrontPage'

export const FrontPage = (): JSX.Element => {
    const { title } = useFrontPage()
    document.title = title || ''
    return <Fragment />
}
