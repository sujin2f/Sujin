import { LoadingStatus } from 'src/common/constants/asset'
import { useGlobalState } from './useGlobalState'

/**
 * External CSS loader
 * Even though multiple components call same css, this will embed it just once
 *
 * @example
 * useStyleLoader('https://cdn.com/style.css')
 */
export const useStyleLoader = (src: string) => {
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

    return state
}
