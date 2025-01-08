import { LoadingStatus } from '@common/constants/asset'
import { useGlobalState } from './useGlobalState'

const usePreConnect = () => {
    const [state, changeState] = useGlobalState(
        'https://fonts.googleapis.com',
        LoadingStatus.INIT,
    )

    if (state === LoadingStatus.INIT) {
        changeState(LoadingStatus.DONE)

        const linkAPI = document.createElement('link')
        linkAPI.href = 'https://fonts.googleapis.com'
        linkAPI.rel = 'preconnect'

        document.head.insertBefore(linkAPI, document.head.firstChild)

        const linkGStatic = document.createElement('link')
        linkGStatic.href = 'https://fonts.gstatic.com'
        linkGStatic.rel = 'preconnect'
        linkGStatic.crossOrigin = 'anonymous'

        document.head.insertBefore(linkGStatic, document.head.firstChild)
    }
}

export const useFontLoader = (font: string) => {
    const src = `https://fonts.googleapis.com/css2?family=${font}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap`

    usePreConnect()
    const [state, changeState] = useGlobalState(src, LoadingStatus.INIT)

    if (state === LoadingStatus.INIT) {
        changeState(LoadingStatus.LOADING)

        const link = document.createElement('link')
        link.href = src
        link.rel = 'stylesheet'
        link.onload = () => {
            changeState(LoadingStatus.DONE)
        }
        link.onerror = () => {
            changeState(LoadingStatus.ERROR)
        }
        document.head.insertBefore(link, document.head.firstChild)
    }
}
