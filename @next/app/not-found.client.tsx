'use client'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* Module */
import { RootState } from '@lib/store'
/* Components */
import { Cards } from '@lib/components/archive/Cards'
import Wrapper from '@lib/components/Wrapper'
import { WidgetTitle } from '@lib/components/WidgetTitle'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { MENU_NAMES, PER_PAGE } from '@sujin/lib/constants'
/* Utils */
import { setRecent } from '@lib/store/slices/recent'
import { useServerAction } from '@lib/hooks/useServerAction'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_ArchivePost[]>
}

export const NotFoundClient = ({ action }: Props) => {
    // Redux store
    const recent = useSelector((state: RootState) => state.recent)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!recent.length, [recent])

    // Read from GraphQL
    const { data, loading, error } = useServerAction(action, hasStore)

    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(setRecent(data))
        }
    }, [data, hasStore, dispatch])

    // Data is not yet ready
    if (!hasStore && (error || !data)) {
        return <></>
    }

    if (loading) {
        return <LoadingArchive />
    }

    return (
        <Wrapper
            title="404 Not Found"
            excerpt="We cannot find the result. See below for recent articles."
            menu={MENU_NAMES.MAIN}
        >
            <WidgetTitle>Recent Posts</WidgetTitle>
            <Cards
                posts={{
                    list: recent.slice(0, PER_PAGE),
                    numPages: 0,
                }}
                keyPrefix="not-found"
                listKey="list"
                large={4}
                medium={6}
                small={12}
            />
        </Wrapper>
    )
}
