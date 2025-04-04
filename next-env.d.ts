/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

declare module 'php-unserialize' {
    export function unserialize(value: string): unknown
}

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
