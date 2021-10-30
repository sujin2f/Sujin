/**
 * Single Hooks
 * @module frontend
 */

import { gql } from '@apollo/client'
import { useContext, useEffect } from 'react'

import { Post } from 'src/types'
import { graphqlClient } from 'src/frontend/utils'

import {
    Context,
    loadPostInit,
    loadPostSuccess,
    setPageInfo,
} from 'src/frontend/store'
import { baseQueryNodes, imageQueryNodes } from 'src/constants'

export const usePost = (slug: string): Post => {
    const [
        {
            posts: { [slug]: post },
        },
        dispatch,
    ] = useContext(Context) as Context

    useEffect(() => {
        if (post) {
            return
        }

        dispatch(
            setPageInfo({
                background: undefined,
                backgroundColor: undefined,
                excerpt: undefined,
                icon: undefined,
                isLoading: true,
                prefix: undefined,
                title: undefined,
                currentPage: 'single',
                wrapperClasses: {
                    'wrapper--headline': true,
                },
            }),
        )
        dispatch(loadPostInit(slug))

        graphqlClient
            .query<{ getPostsBy: Post[] }>({
                query: gql`
                    query {
                        getPostsBy(key: "slug", value: "${encodeURIComponent(
                            slug,
                        )}") {
                            ${baseQueryNodes}
                            content
                            date
                            link
                            parent
                            type
                            menuOrder
                            tags {
                                ${baseQueryNodes}
                            }
                            categories {
                                ${baseQueryNodes}
                            }
                            series {
                                ${baseQueryNodes}
                            }
                            meta {
                                useBackgroundColor
                                backgroundColor
                            }
                            images {
                                list {
                                    ${imageQueryNodes}
                                }
                                icon {
                                    ${imageQueryNodes}
                                }
                                title {
                                    ${imageQueryNodes}
                                }
                                background {
                                    ${imageQueryNodes}
                                }
                                thumbnail {
                                    ${imageQueryNodes}
                                }
                            }
                        }
                    }
                `,
            })
            .then((response) => {
                if (response.data.getPostsBy && response.data.getPostsBy[0]) {
                    dispatch(loadPostSuccess(slug, response.data.getPostsBy[0]))
                    return
                }
            })
            // @todo per error code
            .catch((e) => console.error(e.message))
    }, [dispatch, slug, post])

    useEffect(() => {
        if (!post) {
            return
        }
        dispatch(
            setPageInfo({
                background: post.images.background || post.images.thumbnail,
                backgroundColor: post.meta.backgroundColor,
                excerpt: post.excerpt,
                icon: post.images.icon,
                isLoading: false,
                prefix: '',
                title: post.title,
                currentPage: 'single',
                wrapperClasses: {
                    'wrapper--headline': false,
                },
            }),
        )
    }, [dispatch, slug, post])

    return post
}
