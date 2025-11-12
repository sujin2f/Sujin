// declare module '*.png'
// declare module '*.jpg'
// declare module '*.jpeg'
// declare module '*.svg'
// declare module '*.gif'

declare module 'quartic' {
    export default function (value: number[]): { re: number; im: number }[]
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
    twttr: any
    adsbygoogle: any
    opera: any
    hljs: any
}

declare module '*.scss' {
    const classes: { [key: string]: string }
    export default classes
}
