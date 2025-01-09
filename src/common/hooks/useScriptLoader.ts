import { useEffect } from 'react'
import { LoadingStatus } from '../constants/asset'
import { useGlobalState } from './useGlobalState'
import { Fn } from '../types'

type options = {
    onLoad?: Fn
    onError?: Fn
    disable?: boolean
}

/**
 * External JS loader
 * Even though multiple components call same js, this will embed it just once
 *
 * @example
 * const state = useScriptLoader('https://cdn.com/javascript.js')
 * useEffect(() => {
 *   if (state === LoadingStatus.DONE) {
 *     doSomething()
 *   }
 * }, [state])
 */
export const useScriptLoader = (src: string, options: options = {}) => {
    const [state, changeState] = useGlobalState(src, LoadingStatus.INIT)

    useEffect(() => {
        if (state === LoadingStatus.INIT && !options.disable) {
            changeState(LoadingStatus.LOADING)
            const script = document.createElement('script')
            script.src = src
            script.async = true
            script.onload = () => {
                if (options.onLoad) {
                    options.onLoad()
                }
                changeState(LoadingStatus.DONE)
            }
            script.onerror = () => {
                if (options.onError) {
                    options.onError()
                }
                changeState(LoadingStatus.ERROR)
            }
            document.head.appendChild(script)
        }
    }, [state, changeState, src, options])

    return state
}
