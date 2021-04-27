/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Widget Title
 */
export type WidgetTitle = string
/**
 * Widget Type
 */
export type WidgetType =
    | 'recent-post'
    | 'google-advert'
    | 'flickr'
    | 'tag-cloud'
/**
 * Large size column key
 */
export type WidgetKey = number

export interface GlobalVariable {
    /**
     * Site Title
     */
    title: string
    /**
     * Site Description
     */
    description: string
    /**
     * Site main page URL
     */
    url: string
    /**
     * Default thumbnail
     */
    thumbnail: string
    /**
     * Indicator whether header hidden on front page
     */
    hideFrontHeader: boolean
    /**
     * Indicator whether footer hidden on front page
     */
    hideFrontFooter: boolean
    /**
     * Frontpage post or page slug
     */
    frontPage: string
    /**
     * What shows on front page
     */
    showOnFront: 'post' | 'page'
    /**
     * Sidebars
     */
    widgets: {
        /**
         * Siderail Widgets
         */
        siderail: (
            | RecentPostWidget
            | GoogleAdvertWidget
            | FlickrWidget
            | TagCloudWidget
        )[]
        /**
         * Footer Widgets
         */
        footer: (
            | RecentPostWidget
            | GoogleAdvertWidget
            | FlickrWidget
            | TagCloudWidget
        )[]
    }
    /**
     * Production indicator
     */
    isProd?: boolean
}
export interface RecentPostWidget {
    title: WidgetTitle
    widget: WidgetType
    key: WidgetKey
    /**
     * Small size column key
     */
    small: number
    /**
     * Medium size column key
     */
    medium: number
    /**
     * Large size column key
     */
    large: number
}
export interface GoogleAdvertWidget {
    title: WidgetTitle
    widget: WidgetType
    key: WidgetKey
    /**
     * Client value
     */
    client: string
    /**
     * Slot value
     */
    slot: string
    /**
     * Responsive Mode
     */
    responsive: boolean
}
export interface FlickrWidget {
    title: WidgetTitle
    widget: WidgetType
    key: WidgetKey
    /**
     * Flickr Items
     */
    items: FlickrItems[]
}
export interface FlickrItems {
    /**
     * Image title
     */
    title: string
    /**
     * Link destination
     */
    link: string
    media: ImagesBySizes
}
export interface ImagesBySizes {
    /**
     * Full size image
     */
    origin: string
    /**
     * Small size, trimmed image
     */
    s: string
    /**
     * Small size, untrimmed image
     */
    t: string
    /**
     * Medium size, untrimmed image
     */
    m: string
    /**
     * Big size, untrimmed image
     */
    b: string
}
export interface TagCloudWidget {
    title: WidgetTitle
    widget: WidgetType
    key: WidgetKey
    /**
     * Tag cloud HTML
     */
    html: string
}
