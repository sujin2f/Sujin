export type FlickrImage = {
    title: string
    link: string
    media: string
}

export type FlickrResponseImage = {
    title: string
    link: string
    media: {
        m: string
    }
}

export type FlickrResponse = {
    items: FlickrResponseImage[]
}
