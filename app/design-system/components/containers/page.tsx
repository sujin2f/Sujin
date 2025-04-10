import React from 'react'
import Wrapper from '@app/_components/Wrapper'
import Callout from '@common/components/containers/Callout'
import { MENU_NAMES } from '@app/_lib/types'

export default async function Page() {
    return (
        <Wrapper title="Containers" menu={MENU_NAMES.DESIGN_SYSTEM}>
            <h2>Callout</h2>
            <Callout closeButton dom="section">
                Message
            </Callout>
        </Wrapper>
    )
}
