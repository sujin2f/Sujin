'use client'

import React, { useEffect, use } from 'react'

import { CaseTool } from '@src/components/dev-tools/CaseTool'
import { Column } from '@common/components/layout/Column'
import { MenuNames } from '@src/constants/mysql-query'
import { ParamPromise } from '@app/dev-tools'
import { Row } from '@common/components/layout/Row'
import { TextSort } from '@src/components/dev-tools/TextSort'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { useContext } from '@src/store'

import '@src/scss/dev-tool.scss'

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
        dispatch(setMenu(MenuNames.DEV_TOOL))
    }, [dispatch])

    useEffect(() => {
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title,
                excerpt: '',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch, title])

    return (
        <Row>
            <Column dom="article" small={12}>
                {slug === 'case' && <CaseTool />}
                {slug === 'text-sort' && <TextSort />}
            </Column>
        </Row>
    )
}
