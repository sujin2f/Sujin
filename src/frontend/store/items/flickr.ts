/** store/items/flickr */

import { Flickr as FlickrType } from 'src/frontend/store/items/schema/flickr'

export class Flickr implements FlickrType {
    /**
     * The title of the photo.
     */
    title: string
    /**
     * Flickr URL for the image
     */
    link: string
    /**
     * Image URLs
     */
    media: {
        origin: string
        s: string
        t: string
        b: string
        m: string
    }

    constructor(data: any) {
        this.title = data.title
        this.link = data.link
        this.media = data.media
    }
}
