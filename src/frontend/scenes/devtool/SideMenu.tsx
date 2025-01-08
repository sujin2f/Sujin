import React from 'react'

import { Menu } from '@common/components/layout/Menu'
import { WidgetTitle } from '@frontend/components/widget/WidgetTitle'
import { DEV_TOOL } from '@constants/menu-devtool'

export function SideMenu() {
    return (
        <section>
            <WidgetTitle>Dev Tools</WidgetTitle>

            <Menu direction="vertical" items={DEV_TOOL.children} />
        </section>
    )
}
