import { useQuery } from '@apollo/client'
import { useContext, useEffect } from 'react'
import { GraphQuery, BackgroundsReturnType } from 'src/constants/graphql'
import { Context, ContextType } from 'src/frontend/store'
import { setPageInfo } from 'src/frontend/store/actions'

export const useFrontPage = () => {
    const [, dispatch] = useContext(Context) as ContextType
    const { data } = useQuery<BackgroundsReturnType>(GraphQuery.BACKGROUNDS)

    const title = window.globalVariable.siteName || ''
    const excerpt = window.globalVariable.excerpt || ''
    const background =
        data && data.backgrounds && data.backgrounds.length
            ? data.backgrounds[
                  Math.floor(Math.random() * data.backgrounds.length)
              ]
            : ''

    useEffect(() => {
        const title = window.globalVariable.siteName || ''
        const excerpt = window.globalVariable.excerpt

        dispatch(
            setPageInfo({
                background,
                backgroundColor: '',
                excerpt,
                icon: undefined,
                isLoading: false,
                prefix: '',
                title: title.toUpperCase(),
                currentPage: 'front-page',
                wrapperClasses: {
                    'wrapper--headline': true,
                },
            }),
        )
    }, [dispatch, background])

    return { title, excerpt, background }
}
