'use client'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@apollo/client/react'
/* Module */
import { RootState } from '@lib/store'
/* Components */
import { Cards } from '@lib/components/archive/Cards'
import Wrapper from '@lib/components/Wrapper'
import { WidgetTitle } from '@lib/components/WidgetTitle'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { MENU_NAMES, PER_PAGE } from '@sujin/lib/constants'
import RECENT_QUERY from '@lib/apollo/queries/wordpress/posts/recent.graphql'
/* Utils */
import { setRecent } from '@lib/store/slices/recent'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export const NotFoundClient = () => {
    // Redux store
    const recent = useSelector((state: RootState) => state.recent)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!recent.length, [recent])

    // Read from GraphQL with Intersection Observer & update store
    const { loading, error, data } = useQuery<{ recent: T_ArchivePost[] }>(
        RECENT_QUERY,
        { skip: hasStore },
    )
    useEffect(() => {
        if (!hasStore && data && data.recent.length) {
            dispatch(setRecent(data.recent))
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

// export const NotFoundClient = () => {
//     return (
//         <ApolloProvider client={client}>
//             <ReduxProvider store={store}>
//                 <WrapperWithNotFound />
//             </ReduxProvider>
//         </ApolloProvider>
//     )
// }
