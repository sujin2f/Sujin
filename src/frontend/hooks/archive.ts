import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { TermTypes } from 'src/types'
import { Post } from 'src/types'
import { Context } from 'src/frontend/store'
import {
    loadArchiveInit,
    loadArchiveSuccess,
    setPageInfo,
} from '../store/actions'
import { graphqlClient } from 'src/frontend/utils'

export const useArchive = (
    type: TermTypes,
    slug: string,
    page: number,
    udpateHeader = true,
): Post[] | 'Loading' | 'Failed' => {
    const [
        {
            archive: { [`${type}__${slug}`]: archives },
            posts,
        },
        dispatch,
    ] = useContext(Context) as Context

    const value = archives && archives[page]

    useEffect(() => {
        if (value) {
            return
        }

        dispatch(loadArchiveInit(type, slug, page))

        graphqlClient
            .query<{ getPostsBy: Post[] }>({
                query: gql`
                    query {
                        getPostsBy(key: "${type}", value: "${slug}", page: ${page}) {
                            id
                            slug
                            title
                            excerpt
                            content
                            date
                            link
                            parent
                            type
                            menuOrder
                            tags {
                                id
                                name
                                slug
                            }
                            categories {
                                id
                                name
                                slug
                            }
                            series {
                                id
                                name
                                slug
                            }
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(
                    loadArchiveSuccess(
                        type,
                        slug,
                        page,
                        response.data.getPostsBy,
                    ),
                )
            })
    }, [dispatch, archives])

    useEffect(() => {
        if (!udpateHeader || !archives) {
            return
        }
        dispatch(
            setPageInfo({
                backgroundColor: '',
                description: '',
                icon: '',
                isLoading: false,
                prefix: '',
                title: '',
                useBackgroundColor: false,
                wrapperClasses: {
                    'stretched-background': false,
                    'hide-footer': false,
                },
            }),
        )
    }, [dispatch, slug, archives])

    if (value === 'Failed' || value === 'Loading') {
        return value
    }
    if (!value) {
        return 'Loading'
    }
    return value.map((slug) => posts[slug])
}
