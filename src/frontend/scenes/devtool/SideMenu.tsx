import React from 'react'

import { Menu } from 'src/common/components/layout/Menu'
import { WidgetTitle } from 'src/frontend/components/widget/WidgetTitle'
import { DEV_TOOL } from 'src/constants/menu-devtool'

export function SideMenu() {
    return (
        <section>
            <WidgetTitle>Dev Tools</WidgetTitle>

            <Menu direction="vertical" items={DEV_TOOL.children} />
        </section>
    )
}
