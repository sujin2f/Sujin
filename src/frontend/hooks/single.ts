/*
 * Single Hooks
 * import {} from 'store/hooks/single';
 */

import { gql } from '@apollo/client'
import { useContext, useEffect } from 'react'
import { Post } from 'src/types'
import { Context } from '../store'
import { loadPostInit, loadPostSuccess, setPageInfo } from '../store/actions'
import { graphqlClient } from 'src/frontend/utils'

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

        dispatch(loadPostInit(slug))

        graphqlClient
            .query<{ getPostsBy: Post[] }>({
                query: gql`
                    query {
                        getPostsBy(key: "slug", value: "${slug}") {
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
                if (response.data.getPostsBy && response.data.getPostsBy[0]) {
                    dispatch(loadPostSuccess(slug, response.data.getPostsBy[0]))
                    return
                }
            })
    }, [dispatch, slug, post])

    useEffect(() => {
        if (!post) {
            return
        }
        dispatch(
            setPageInfo({
                backgroundColor: '',
                description: post.excerpt,
                icon: '',
                isLoading: false,
                prefix: '',
                title: post.title,
                useBackgroundColor: false,
                wrapperClasses: {
                    'stretched-background': false,
                    'hide-footer': false,
                },
            }),
        )
    }, [dispatch, slug, post])

    return post
}
