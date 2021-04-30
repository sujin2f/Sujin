/** store/items/post */

import { SimplePost } from 'src/frontend/store/items/simple-post'

import { Post as TypePost } from 'src/frontend/store/items/schema/post'

export class Post extends SimplePost implements TypePost {
    /**
     * Content
     */
    content: string
    /**
     * Comment status
     */
    commentStatus?: boolean
    /**
     * Series
     */
    series: SimplePost[]
    /**
     * Prev / Next
     */
    prevNext: {
        prev?: SimplePost
        next?: SimplePost
    }
    /**
     * Related contents
     */
    related: SimplePost[]
    /**
     * Post Type
     */
    type: 'post' | 'page'
    /**
     * Table of content
     */
    toc: {
        /**
         * Tag name
         */
        tag: 'h1' | 'h2' | 'h3' | 'h4'
        /**
         * Heading text
         */
        text: string
    }[]

    constructor(data: any) {
        super(data)

        this.content = data.content
        this.commentStatus = data.commentStatus

        this.series = data.series.map(
            (simple: SimplePost) => new SimplePost(simple),
        )
        this.prevNext = {
            prev: data.prevNext.prev
                ? new SimplePost(data.prevNext.prev)
                : undefined,
            next: data.prevNext.next
                ? new SimplePost(data.prevNext.next)
                : undefined,
        }
        this.related = data.related.map(
            (simple: SimplePost) => new SimplePost(simple),
        )

        this.type = data.type
        this.toc = data.toc
    }
}
