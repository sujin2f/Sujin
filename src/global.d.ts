// declare module '*.png'
// declare module '*.jpg'
// declare module '*.jpeg'
// declare module '*.svg'
// declare module '*.gif'

declare module 'php-unserialize' {
    export function unserialize(value: string): unknown
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
    twttr: any
    adsbygoogle: any
    opera: any
    hljs: any
}
