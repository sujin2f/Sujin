import { useQuery } from '@apollo/client'
import { useContext, useEffect } from 'react'
import {
    GraphQuery,
    PostReturnType,
    PostVariables,
} from 'src/constants/graphql'
import { Context, ContextType } from 'src/frontend/store'
import { setPageInfo } from 'src/frontend/store/actions'
import { Nullable } from 'src/types/common'

export const usePost = (slug: Nullable<string>) => {
    const [, dispatch] = useContext(Context) as ContextType
    const { data, loading, error } = useQuery<PostReturnType, PostVariables>(
        GraphQuery.POST,
        {
            variables: { slug: encodeURIComponent(slug || '') },
            skip: !slug,
        },
    )
    const post = data && data.post

    useEffect(() => {
        if (!post) {
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
    }, [dispatch, post])

    const title = [window.globalVariable.siteName || '']
    if (post) {
        title.push(post.title)
    }
    return { post, loading, error, title: title.join(' - ') }
}
