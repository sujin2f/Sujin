'use client'

import React, { useEffect } from 'react'

import { useContext } from '@src/store'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { MenuNames } from '@src/constants/mysql-query'
import { Term } from '@src/types/wordpress'
import { Cards } from '@app/components/archive/cards'
import { Paging } from '@app/components/archive/paging'
import { Row } from '@common/components/layout/Row'

type Props = {
    archive: Term
}

export const Wrapper = (props: Props) => {
    const {
        archive: { title, slug, excerpt, type, image, posts, pages, page },
    } = props
    const [, dispatch] = useContext()

    useEffect(() => {
        dispatch(setWrapperClass(''))
        dispatch(setMenu(MenuNames.MAIN))
        dispatch(
            setBanner({
                title: title,
                excerpt: excerpt,
                icon: undefined,
                prefix: type,
                background: image,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch, excerpt, image, title, type])

    return (
        <>
            <Row>
                <Cards
                    posts={posts}
                    keyPrefix={`${type}-${slug}-${page}`}
                    large={4}
                    medium={6}
                    small={12}
                />
            </Row>

            <Paging pages={pages} page={page} urlPrefix={`/${type}/${slug}`} />
        </>
    )
}
