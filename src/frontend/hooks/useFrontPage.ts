import { useQuery } from '@apollo/client'
import { useContext, useEffect } from 'react'
import { GraphQuery, BackgroundsReturnType } from 'src/constants/graphql'
import { Context, ContextType, setPageInfo } from 'src/frontend/store'

export const useFrontPage = () => {
    const [, dispatch] = useContext(Context) as ContextType
    const { data } = useQuery<BackgroundsReturnType>(GraphQuery.BACKGROUNDS)
    const backgrounds = data && data.backgrounds

    useEffect(() => {
        const title = window.globalVariable.title || ''
        const excerpt = window.globalVariable.excerpt
        const randomBackground =
            backgrounds && backgrounds.length
                ? backgrounds[Math.floor(Math.random() * backgrounds.length)]
                : undefined

        dispatch(
            setPageInfo({
                background: randomBackground,
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
    }, [dispatch, backgrounds])
}
