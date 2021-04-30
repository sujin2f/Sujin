/** store/items/simple-post */

import { Image } from 'src/frontend/store/items/image'
import { Term } from 'src/frontend/store/items/term'
import { PostMeta } from 'src/frontend/store/items/schema/post-meta'

import { SimplePost as TypeSimplePost } from 'src/frontend/store/items/schema/simple-post'

export class SimplePost implements TypeSimplePost {
    /**
     * Unique ID
     */
    id: number
    /**
     * Post slug
     */
    slug: string
    /**
     * Title
     */
    title: string
    /**
     * Excerpt
     */
    excerpt: string
    /**
     * Date
     */
    date: string
    /**
     * Link URL
     */
    link: string
    /**
     * Tags
     */
    tags: Term[]
    thumbnail: Image
    meta: PostMeta

    constructor(data: any) {
        this.id = data.id
        this.slug = data.slug
        this.link = data.link
        this.title = decodeURIComponent(data.title)
        this.date = data.date

        this.meta = {
            background: new Image(data.meta.background),
            icon: new Image(data.meta.icon),
            list: new Image(data.meta.list),
            title: new Image(data.meta.title),
            thumbnail: new Image(data.meta.thumbnail),
            backgroundColor: data.meta.backgroundColor,
            useBackgroundColor: data.meta.useBackgroundColor,
        }
        this.thumbnail = new Image(data.thumbnail)
        this.excerpt = decodeURIComponent(data.excerpt)
        this.tags =
            (data.tags && data.tags.map((tag: Term) => new Term(tag))) || []
    }

    public parseDate(): { [key: string]: string | number } {
        const date = new Date(this.date)

        return {
            day: date.getDate(),
            month: date.toLocaleString('en-us', { month: 'short' }),
            year: date.getFullYear(),
        }
    }
}
