import { GlobalState } from 'src/common/model/GlobalState'
import { LoadingStatus } from 'src/common/constants/asset'
import { useEffect, useState } from 'react'

const usePreConnect = () => {
    const globalState = GlobalState.getInstance(
        'https://fonts.googleapis.com',
        LoadingStatus.INIT,
    )
    const [, setState] = useState<LoadingStatus>(globalState.value)
    const state = globalState.value

    if (state === LoadingStatus.INIT) {
        globalState.value = LoadingStatus.DONE

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
}

export const useFontLoader = (font: string) => {
    usePreConnect()
    const src = `https://fonts.googleapis.com/css2?family=${font}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap`
    const globalState = GlobalState.getInstance(src, LoadingStatus.INIT)
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
