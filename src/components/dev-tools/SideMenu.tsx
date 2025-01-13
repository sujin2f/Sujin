import React from 'react'

import { Menu } from '@common/components/layout/Menu'
import { WidgetTitle } from '@src/components/WidgetTitle'
import { PROJECT } from '@src/constants/menu-static'

export function SideMenu() {
    return (
        <section>
            <WidgetTitle>Dev Tools</WidgetTitle>

            <Menu direction="vertical" items={PROJECT.children} />
        </section>
    )
}
