/*
 * Single Hooks
 * import {} from 'store/hooks/single';
 */

import { gql } from '@apollo/client'
import { useContext, useEffect } from 'react'
import { Post } from 'src/types'
import { Context } from '../store'
import { loadPostInit, loadPostSuccess } from '../store/actions'
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
                        }
                    }
                `,
            })
            .then((response) => {
                if (response.data.getPostsBy && response.data.getPostsBy[0]) {
                    dispatch(loadPostSuccess(slug, response.data.getPostsBy[0]))
                    return
                }
                throw new Error()
            })
    }, [dispatch, slug, post])

    return post
}
