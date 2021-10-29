import { Post } from 'src/types'

export const dummyPost: Post = {
    id: 0,
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    date: '',
    link: '',
    parent: 0,
    type: '',
    menuOrder: 0,
    tags: [],
    categories: [],
    series: [],
}
export enum PostType {
    POST = 'post',
    PAGE = 'page',
}
