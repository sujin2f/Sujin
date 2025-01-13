'use client'

import React, { useEffect, use } from 'react'

import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { useContext } from '@src/store'
import { setBanner, setWrapperClass } from '@src/store/actions'
import { SideMenu } from '@src/components/dev-tools/SideMenu'
import { CaseTool } from '@src/components/dev-tools/CaseTool'
import { ParamPromise } from '@app/dev-tools'
import { TextSort } from '@src/components/dev-tools/TextSort'

export default function DevTool({ params }: ParamPromise) {
    const { slug } = use(params)
    const [, dispatch] = useContext()
    let title = ''

    switch (slug) {
        case 'case':
            title = 'Case Tool'
            break
        case 'text-sort':
            title = 'Text Sort'
            break
    }

    useEffect(() => {
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title,
                excerpt:
                    'We cannot find the result. See below for recent articles.',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch, title])

    return (
        <Row>
            <Column dom="aside" large={3} small={12}>
                <SideMenu />
            </Column>

            <Column dom="article" large={9} small={12}>
                {slug === 'case' && <CaseTool />}
                {slug === 'text-sort' && <TextSort />}
            </Column>
        </Row>
    )
}
