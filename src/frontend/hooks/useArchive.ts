import { useQuery } from '@apollo/client'
import { useContext, useEffect } from 'react'
import {
    ArchiveReturnType,
    ArchiveVariables,
    GraphQuery,
} from 'src/constants/graphql'
import { Context, ContextType } from 'src/frontend/store'
import { setPageInfo } from 'src/frontend/store/actions'
import { TermTypes } from 'src/types'

export const useArchive = (type: TermTypes, slug: string, page: number) => {
    const [, dispatch] = useContext(Context) as ContextType
    const { data, loading, error } = useQuery<
        ArchiveReturnType,
        ArchiveVariables
    >(GraphQuery.ARCHIVE, {
        variables: { type, slug, page },
    })
    const archive = data && data.archive

    useEffect(() => {
        if (!archive) {
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
            return
        }

        dispatch(
            setPageInfo({
                background: archive.image,
                backgroundColor: '',
                excerpt: archive.excerpt,
                icon: undefined,
                isLoading: false,
                prefix: type,
                title: archive.title,
                currentPage: 'archive',
                wrapperClasses: {
                    'wrapper--headline': false,
                },
            }),
        )
    }, [dispatch, archive, type])

    return { archive, loading, error }
}
