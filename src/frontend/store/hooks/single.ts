/*
 * Single Hooks
 * import {} from 'store/hooks/single';
 */

import { useContext, useEffect } from 'react'

import DEFAULT_BACKGROUND from 'src/assets/images/background/category.jpg'
import DEFAULT_BACKGROUND_MOBILE from 'src/assets/images/background/category-mobile.jpg'
import { ResponseCode } from 'src/frontend/constants/enum'
import { Context } from 'src/frontend/store'
import {
    setPageHeader,
    setPublicClass,
    setLeftRail,
    loadPostInit,
    loadPostSuccess,
    loadPostFail,
} from 'src/frontend/store/actions'
import { StatePost, StateLeftRail } from 'src/frontend/store/reducer'
import { Post } from 'src/types'
import { parseExImage } from 'src/frontend/utils/common'

const loaded: string[] = []

const usePostRequest = (slug: string): void => {
    const [{ posts }, dispatch] = useContext(Context) as Context
    const post = posts[slug]

    // Request
    useEffect(() => {
        if (loaded.includes(slug) || post) {
            return
        }

        dispatch(
            setPageHeader({
                isLoading: true,
            }),
        )

        dispatch(setLeftRail({}))

        dispatch(loadPostInit(slug))

        // axios
        //     .get(`https://devbackend.sujinc.com/wp-json/sujin/v1/post/${slug}`)
        //     .then((response) => {
        //         if (response.status === ResponseCode.Success) {
        //             dispatch(loadPostSuccess(slug, new Post(response.data)))
        //             return
        //         }
        //         dispatch(loadPostFail(slug))
        //     })
        //     .catch((e) => {
        //         dispatch(loadPostFail(slug))
        //     })

        loaded.push(slug)
    }, [post, dispatch, slug])
}

const usePostInit = (slug: string): StatePost => {
    const [{ posts }, dispatch] = useContext(Context) as Context
    const post = posts[slug]

    useEffect(() => {
        if (!post || !post.item) {
            return
        }

        const backgroundImage = parseExImage(
            post.item!.meta.background,
            post.item!.thumbnail,
            'large',
            'medium',
            DEFAULT_BACKGROUND,
            DEFAULT_BACKGROUND_MOBILE,
        )

        dispatch(
            setPublicClass({
                'stretched-background': false,
                'hide-footer': false,
                'hide-header': false,
            }),
        )

        dispatch(
            setPageHeader({
                background: backgroundImage,
                backgroundColor: post.item!.meta.backgroundColor || '',
                description: post.item!.excerpt,
                icon:
                    (post.item!.meta.icon && post.item!.meta.icon.small) || '',
                isLoading: false,
                prefix: '',
                title: post.item!.title,
                useBackgroundColor: post.item!.meta.useBackgroundColor || false,
            }),
        )
    }, [post, dispatch])

    return post
}

export const useLeftRail = (): StateLeftRail => {
    const [{ leftRail }] = useContext(Context) as Context
    return leftRail
}

export const usePost = (slug: string): StatePost => {
    usePostRequest(slug)
    return usePostInit(slug)
}
