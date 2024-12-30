import { useEffect, useState } from 'react'
import { GlobalState } from 'src/common/model/GlobalState'
import { LoadingStatus } from 'src/common/constants/asset'

/*
 * External JS loader
 * Even though multiple components call same js, this will embed it just once
 *
 * const state = useScriptLoader('https://cdn.com/javascript.js')
 * useEffect(() => {
 *   if (state === LoadingStatus.COMPLETE) {
 *     doSomething()
 *   }
 * }, [state])
 */
export const useScriptLoader = (src: string) => {
    const globalState = GlobalState.getInstance(src, LoadingStatus.INIT)
    const [, setState] = useState<LoadingStatus>(globalState.value)
    const state = globalState.value

    if (state === LoadingStatus.INIT) {
        globalState.value = LoadingStatus.LOADING
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => {
            globalState.value = LoadingStatus.DONE
        }
        script.onerror = () => {
            globalState.value = LoadingStatus.ERROR
        }
        document.body.appendChild(script)
    }

    function render(newState: LoadingStatus) {
        // This will be called when the global state changes
        setState(newState)
    }

    useEffect(() => {
        // Subscribe to a global state when a component mounts
        globalState.subscribe(render)

        return () => {
            // Unsubscribe from a global state when a component unmounts
            globalState.unsubscribe(render)
        }
    })

    return state
}
