import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { TermTypes } from 'src/constants'
import { Post } from 'src/types'
import { Context } from 'src/frontend/store'
import { loadArchiveInit, loadArchiveSuccess } from '../store/actions'
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

    if (value === 'Failed' || value === 'Loading') {
        return value
    }
    if (!value) {
        return 'Loading'
    }
    return value.map((slug) => posts[slug])
}

// /*
//  * Archive Hooks
//  * store/hooks/archive
//  */

// import { useContext, useEffect } from 'react'

// import DEFAULT_BACKGROUND from 'src/assets/images/background/category.jpg'
// import DEFAULT_BACKGROUND_MOBILE from 'src/assets/images/background/category-mobile.jpg'
// import { ResponseCode, TermTypes } from 'src/frontend/constants/enum'
// import { Context } from 'src/frontend/store'
// import {
//     setPageHeader,
//     setPublicClass,
//     // loadArchiveInit,
//     // loadArchiveSuccess,
//     // loadArchiveFail,
//     // loadPostSuccess,
// } from 'src/frontend/store/actions'
// import { Archive } from 'src/frontend/store/items/archive'
// import { StateArchive } from 'src/frontend/store/reducer'
// import { Post } from 'src/types'
// import { parseExImage } from 'src/frontend/utils/common'

// const loaded: string[] = []

// // @todo not to load again and again
// const useArchiveRequest = (
//     type: TermTypes,
//     slug: string,
//     page: number,
//     udpateHeader: boolean,
// ): void => {
//     const [{ archive }, dispatch] = useContext(Context) as Context
//     const currentArchive = archive[type][slug] && archive[type][slug][page]
//     const loadedKey = `{${type}-${slug}-${page}}`

//     // Request
//     useEffect(() => {
//         if (loaded.includes(loadedKey) || currentArchive) {
//             return
//         }

//         if (udpateHeader) {
//             dispatch(
//                 setPageHeader({
//                     isLoading: true,
//                 }),
//             )
//         }

//         dispatch(loadArchiveInit(type, slug, page))

//         // axios
//         //     .get(
//         //         `https://devbackend.sujinc.com/wp-json/sujin/v1/archive/${type}/${slug}/${page}`,
//         //     )
//         //     .then((response) => {
//         //         if (response.status === ResponseCode.Success) {
//         //             response.data.items = response.data.items.map(
//         //                 (entity: any) => {
//         //                     const post = new Post(entity)
//         //                     dispatch(loadPostSuccess(slug, post))

//         //                     return post
//         //                 },
//         //             )

//         //             dispatch(
//         //                 loadArchiveSuccess(
//         //                     type,
//         //                     slug,
//         //                     page,
//         //                     new Archive(response.data),
//         //                 ),
//         //             )
//         //             return
//         //         }
//         //         dispatch(loadArchiveFail(type, slug, page))
//         //     })
//         //     .catch((e) => {
//         //         dispatch(loadArchiveFail(type, slug, page))
//         //     })

//         loaded.push(slug)
//     }, [dispatch, loadedKey, page, slug, type, currentArchive, udpateHeader])
// }

// const useArchiveInit = (
//     type: TermTypes,
//     slug: string,
//     page: number,
//     udpateHeader: boolean,
// ): StateArchive => {
//     const [{ archive }, dispatch] = useContext(Context) as Context
//     const currentList = archive[type][slug] && archive[type][slug][page]

//     useEffect(() => {
//         if (!currentList || !currentList.item || !udpateHeader) {
//             return
//         }

//         const backgroundImage = parseExImage(
//             currentList.item.thumbnail,
//             currentList.item.thumbnail,
//             'large',
//             'medium',
//             DEFAULT_BACKGROUND,
//             DEFAULT_BACKGROUND_MOBILE,
//         )

//         dispatch(
//             setPublicClass({
//                 'stretched-background': false,
//                 'hide-footer': false,
//             }),
//         )

//         dispatch(
//             setPageHeader({
//                 background: backgroundImage,
//                 backgroundColor: '',
//                 description: currentList.item.description,
//                 icon: '',
//                 isLoading: false,
//                 prefix: type,
//                 title: currentList.item.title,
//                 useBackgroundColor: false,
//             }),
//         )
//     }, [currentList, dispatch, type, udpateHeader])

//     return currentList
// }

// export const useArchive = (
//     type: TermTypes,
//     slug: string,
//     page: number,
//     udpateHeader = true,
// ): StateArchive => {
//     useArchiveRequest(type, slug, page, udpateHeader)
//     return useArchiveInit(type, slug, page, udpateHeader)
// }
