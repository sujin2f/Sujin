import { LoadingStatus } from '../constants/asset'
import { useGlobalState } from './useGlobalState'

/*
 * External JS loader
 * Even though multiple components call same js, this will embed it just once
 *
 * const state = useScriptLoader('https://cdn.com/javascript.js')
 * useEffect(() => {
 *   if (state === LoadingStatus.DONE) {
 *     doSomething()
 *   }
 * }, [state])
 */
export const useScriptLoader = (src: string) => {
    const [state, changeState] = useGlobalState(src, LoadingStatus.INIT)

    if (state === LoadingStatus.INIT) {
        changeState(LoadingStatus.LOADING)
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => {
            changeState(LoadingStatus.DONE)
        }
        script.onerror = () => {
            changeState(LoadingStatus.ERROR)
        }
        document.body.appendChild(script)
    }

    return state
}
