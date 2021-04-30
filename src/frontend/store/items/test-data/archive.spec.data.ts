import { Archive } from '../archive'
import { rawData as post } from './post.spec.data'

export const rawData = {
    description: 'Blog',
    items: [post, post, post],
    name: 'Blog',
    thumbnail:
        'http://sujinc.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-25-at-1.20.53-AM.png',
    total: 47,
    totalPages: 12,
}

export const response = new Archive(rawData)
