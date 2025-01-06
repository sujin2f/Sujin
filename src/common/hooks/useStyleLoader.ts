import { GlobalState } from 'src/common/model/GlobalState'
import { LoadingStatus } from 'src/common/constants/asset'
import { useEffect, useState } from 'react'

/*
 * External CSS loader
 * Even though multiple components call same css, this will embed it just once
 *
 * useStyleLoader('https://cdn.com/style.css')
 */
export const useStyleLoader = (src: string) => {
    const globalState = GlobalState.getInstance(
        src,
        LoadingStatus.INIT,
    ) as GlobalState<LoadingStatus>
    const [, setState] = useState<LoadingStatus>(globalState.value)
    const state = globalState.value

    if (state === LoadingStatus.INIT) {
        globalState.value = LoadingStatus.LOADING
        const link = document.createElement('link')
        link.href = src
        link.rel = 'stylesheet'
        link.onload = () => {
            globalState.value = LoadingStatus.DONE
        }
        link.onerror = () => {
            globalState.value = LoadingStatus.ERROR
        }
        document.head.insertBefore(link, document.head.firstChild)
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
