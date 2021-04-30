/** store/items/archive */

import { Post } from 'src/frontend/store/items/post'
import { Image } from 'src/frontend/store/items/image'

import { Archive as TypeArchive } from 'src/frontend/store/items/schema/archive'

export class Archive implements TypeArchive {
    /**
     * Archive Title
     */
    title: string
    /**
     * Archive Description
     */
    description: string
    thumbnail: Image
    /**
     * Total number of posts
     */
    total: number
    /**
     * Total number of page
     */
    totalPages: number
    /**
     * Posts
     */
    items: Post[]

    constructor(data: any) {
        this.title = decodeURIComponent(data.title) || ''
        this.description = decodeURIComponent(data.description) || ''
        this.thumbnail = new Image(data.thumbnail)
        this.total = data.total
        this.totalPages = parseInt(data.totalPages, 10) || 1

        this.items = data.items.map((post: Post) => new Post(post))
    }
}
