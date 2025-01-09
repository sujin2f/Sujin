import React from 'react'

import { Menu } from 'src/common/components/layout/Menu'
import { WidgetTitle } from 'src/frontend/components/widget/WidgetTitle'
import { PROJECT } from 'src/constants/menu-static'

export function SideMenu() {
    return (
        <section>
            <WidgetTitle>Dev Tools</WidgetTitle>

            <Menu direction="vertical" items={PROJECT.children} />
        </section>
    )
}
