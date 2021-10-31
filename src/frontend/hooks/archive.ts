import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { TermTypes, Post, Term } from 'src/types'
import { graphqlClient } from 'src/frontend/utils'
import {
    Context,
    loadArchiveInit,
    loadArchiveSuccess,
    setPageInfo,
} from 'src/frontend/store'
import { baseQueryNodes, imageQueryNodes } from 'src/constants'

export const useArchive = (
    type: TermTypes,
    slug: string,
    page: number,
    udpateHeader = true,
): [Post[] | 'Loading' | 'Failed', Term?] => {
    const [
        {
            archive: { [`${type}__${slug}`]: archives },
            posts,
        },
        dispatch,
    ] = useContext(Context) as Context

    const value = archives && archives.items && archives.items[page]
    const term = archives && archives.term

    useEffect(() => {
        if (value) {
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
                currentPage: 'archive',
                wrapperClasses: {
                    'wrapper--headline': true,
                },
            }),
        )

        dispatch(loadArchiveInit(type, slug, page))

        let archiveMetaQuery = ''
        switch (type) {
            case TermTypes.category:
            case TermTypes.post_tag:
            case TermTypes.series:
            case TermTypes.tag:
                archiveMetaQuery = `
                    getTermBy(key: "${type}", value: "${encodeURIComponent(
                    slug,
                )}") {
                        ${baseQueryNodes}
                        total
                        limit
                        pages
                        image {
                            ${imageQueryNodes}
                        }
                    }
                `
                break
        }

        graphqlClient
            .query<{ getPostsBy: Post[]; getTermBy?: Term }>({
                query: gql`
                    query {
                        getPostsBy(key: "${type}", value: "${encodeURIComponent(
                    slug,
                )}", page: ${page}) {
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
                        ${archiveMetaQuery}
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
                        response.data.getTermBy,
                    ),
                )
            })
    }, [dispatch, archives, page, slug, type, value])

    useEffect(() => {
        if (!udpateHeader || !archives || !term) {
            return
        }
        dispatch(
            setPageInfo({
                background: term?.image,
                backgroundColor: '',
                excerpt: term?.excerpt,
                icon: undefined,
                isLoading: false,
                prefix: type,
                title: term?.title,
                currentPage: 'archive',
                wrapperClasses: {
                    'wrapper--headline': false,
                },
            }),
        )
    }, [dispatch, slug, archives, term, type, udpateHeader])

    if (value === 'Failed' || value === 'Loading') {
        return [value, term]
    }
    if (!value) {
        return ['Loading', term]
    }
    return [value.map((slug) => posts[slug]), term]
}
