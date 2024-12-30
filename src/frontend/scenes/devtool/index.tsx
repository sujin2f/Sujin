import React, { PropsWithChildren } from 'react'

import { FixedHeader } from 'src/frontend/scenes/layout/FixedHeader'
import { Footer } from 'src/frontend/scenes/layout/Footer'

import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import { SideMenu } from 'src/frontend/components/dev-tool/SideMenu'

import { useGlobalState } from 'src/frontend/hooks/global'

const DevTool = (props: PropsWithChildren<{}>): JSX.Element => {
    const { returnClasses, wrapperElement } = useGlobalState(
        'devtool',
        'scrolled',
    )

    return (
        <div ref={wrapperElement} className={`${returnClasses} wrapper`}>
            <header>
                <FixedHeader isDevTool={true} />
            </header>
            <Row dom="main" expanded={true}>
                <Column small={12} large={2} dom="aside">
                    <SideMenu />
                </Column>
                <Column small={12} large={10} dom="article">
                    {props.children}
                </Column>
            </Row>
            <footer className="footer">
                <Footer />
            </footer>
        </div>
    )
}

export default DevTool
