import { useQuery } from '@apollo/client'
import { useContext, useEffect } from 'react'
import { GraphQuery, BackgroundsReturnType } from 'src/constants/graphql'
import { Context, ContextType } from 'src/frontend/store'
import { setPageInfo } from 'src/frontend/store/actions'

export const use404 = () => {
    const [, dispatch] = useContext(Context) as ContextType
    const { data } = useQuery<BackgroundsReturnType>(GraphQuery.BACKGROUNDS)
    const backgrounds = data && data.backgrounds

    useEffect(() => {
        const title = '404'
        const excerpt = 'Not Found'
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
                title,
                currentPage: '404',
                wrapperClasses: {
                    'wrapper--headline': true,
                },
            }),
        )
    }, [dispatch, backgrounds])

    return { title: `${window.globalVariable.siteName} - Not Found` }
}
