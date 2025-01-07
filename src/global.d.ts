declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.gif'

declare module 'php-unserialize' {
    export function unserialize(value: string): unknown
}

type FrontendVars = {
    SITE_NAME: string
    EXCERPT: string
    FRONTEND: string
    GOOGLE_AD_CLIENT: string
    GOOGLE_AD_SLOT: string
    IS_PRODUCTION: boolean
    FLICKR_ID: string
}

type GlobalVars = FrontendVars & {
    TITLE: string
    DESCRIPTION: string
    IMAGE: string
    URL: string
}

interface Window {
    twttr: any
    adsbygoogle: any
    opera: any
    sujin: FrontendVars
}
