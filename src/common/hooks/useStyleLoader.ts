import { GlobalState } from '../model/GlobalState'

export enum LoadingStatus {
    INIT = 'init',
    ON_LOADING = 'onload',
    COMPLETE = 'complete',
}

/*
 * External CSS loader
 * Even though multiple components call same css, this will embed it just once
 *
 * useStyleLoader('https://cdn.com/style.css')
 */
export const useStyleLoader = (...src: string[]) => {
    src.forEach((url) => {
        const globalState = GlobalState.getInstance(url, LoadingStatus.INIT)
        const state = globalState.value
        if (state === LoadingStatus.INIT) {
            globalState.value = LoadingStatus.COMPLETE
            const link = document.createElement('link')
            link.href = url
            link.rel = 'stylesheet'
            document.head.insertBefore(link, document.head.firstChild)
        }
    })

    return
}
