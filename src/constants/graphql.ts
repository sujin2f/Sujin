import {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
} from '@common/graphql/object-type'
import { Operation } from '@common/graphql/operation'
import { GraphQLQueries, GraphQLQuery } from '@common/graphql/query-type'
import { getSchema } from '@common/graphql/schema'
import { TermTypes } from '@project/types/wordpress'

const list = true
const required = true

const ImageSize = new GraphQLObjectType({
    name: 'ImageSize',
    fields: {
        key: { type: GraphQLString },
        file: { type: GraphQLString },
    },
})

const Image = new GraphQLObjectType({
    name: 'Image',
    fields: {
        url: { type: GraphQLString },
        mimeType: { type: GraphQLString },
        sizes: { type: ImageSize, list },
    },
})

const Images = new GraphQLObjectType({
    name: 'Images',
    fields: {
        id: { type: GraphQLInt },
        list: { type: Image },
        icon: { type: Image },
        title: { type: Image },
        background: { type: Image },
        thumbnail: { type: Image },
    },
})

const MenuItem = new GraphQLObjectType({
    name: 'MenuItem',
    fields: {
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        target: { type: GraphQLString },
        link: { type: GraphQLString },
        htmlClass: { type: GraphQLString, list },
        children: { type: 'self' },
    },
})

const PostMeta = new GraphQLObjectType({
    name: 'PostMeta',
    fields: {
        useBackgroundColor: { type: GraphQLBoolean },
        backgroundColor: { type: GraphQLString },
    },
})

const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
        id: { type: GraphQLInt },
        slug: { type: GraphQLString },
        title: { type: GraphQLString },
        excerpt: { type: GraphQLString },
        content: { type: GraphQLString },
        date: { type: GraphQLString },
        link: { type: GraphQLString },
        parent: { type: GraphQLInt },
        type: { type: GraphQLString },
        menuOrder: { type: GraphQLInt },
        // tags: [Term]
        // categories: [Term]
        // series: [Term]
        images: { type: Images },
        meta: { type: PostMeta },
        related: { type: 'self', list },
    },
})

const PrevNext = new GraphQLObjectType({
    name: 'PrevNext',
    fields: {
        prev: { type: Post },
        next: { type: Post },
    },
})

const Term = new GraphQLObjectType({
    name: 'Term',
    fields: {
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        slug: { type: GraphQLString },
        type: { type: GraphQLString },
        total: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        pages: { type: GraphQLInt },
        excerpt: { type: GraphQLString },
        image: { type: Image },
        posts: { type: Post, list },
        page: { type: GraphQLInt },
    },
})

Post.addField('prevNext', { type: PrevNext })
Post.addField('tags', { type: Term, list })
Post.addField('categories', { type: Term, list })
Post.addField('series', { type: Term, list })

const FlickrImage = new GraphQLObjectType({
    name: 'FlickrImage',
    fields: {
        title: { type: GraphQLString },
        link: { type: GraphQLString },
        media: { type: GraphQLString },
    },
})

const TagCloud = new GraphQLObjectType({
    name: 'TagCloud',
    fields: {
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        slug: { type: GraphQLString },
        count: { type: GraphQLInt },
        hit: { type: GraphQLInt },
    },
})

export const queryBackgrounds = new GraphQLQuery({
    name: 'backgrounds',
    return: {
        type: Image,
        list,
    },
})

export const queryPost = new GraphQLQuery({
    name: 'post',
    arguments: {
        slug: {
            type: GraphQLString,
            required,
        },
    },
    return: {
        type: Post,
    },
})

export const queryMenu = new GraphQLQuery({
    name: 'menu',
    arguments: {
        slug: {
            type: GraphQLString,
            required,
        },
    },
    return: {
        type: MenuItem,
        list,
    },
})

export const queryArchive = new GraphQLQuery({
    name: 'archive',
    arguments: {
        type: {
            type: GraphQLString,
            required,
        },
        slug: {
            type: GraphQLString,
            required,
        },
        page: {
            type: GraphQLInt,
            required,
        },
    },
    return: {
        type: Term,
    },
})

export const queryFlickr = new GraphQLQuery({
    name: 'flickr',
    arguments: {
        id: {
            type: GraphQLString,
            required,
        },
    },
    return: {
        type: FlickrImage,
        list,
    },
})

export const queryTagCloud = new GraphQLQuery({
    name: 'tagCloud',
    return: {
        type: TagCloud,
        list,
    },
})

export const queryRecent = new GraphQLQuery({
    name: 'recent',
    return: {
        type: Post,
        list,
    },
})

const imageOperationQuery = [
    'url',
    'mimeType',
    {
        sizes: ['key', 'file'],
    },
]
const imagesOperationQuery = [
    'id',
    {
        list: imageOperationQuery,
        icon: imageOperationQuery,
        title: imageOperationQuery,
        background: imageOperationQuery,
        thumbnail: imageOperationQuery,
    },
]
const menuOperationQuery = ['id', 'title', 'target', 'link', 'htmlClass']
const commonOperationQuery = ['id', 'slug', 'title']
const taxonomyOperationQuery = [...commonOperationQuery, 'page', 'type']
const miniPostOperationQuery = [
    ...commonOperationQuery,
    'link',
    {
        images: imagesOperationQuery,
    },
]

export const operationBackgrounds = new Operation(
    queryBackgrounds,
    [],
    ...imageOperationQuery,
)

export const operationMenu = new Operation<{ slug: string }>(
    queryMenu,
    ['slug'],
    ...menuOperationQuery,
    {
        children: menuOperationQuery,
    },
)

export const operationPost = new Operation<{ slug: string }>(
    queryPost,
    ['slug'],
    ...miniPostOperationQuery,
    'date',
    'excerpt',
    'content',
    'parent',
    'type',
    {
        tags: taxonomyOperationQuery,
        categories: taxonomyOperationQuery,
        series: taxonomyOperationQuery,
        meta: ['useBackgroundColor', 'backgroundColor'],
        prevNext: [
            {
                prev: [...commonOperationQuery, 'link'],
                next: [...commonOperationQuery, 'link'],
            },
        ],
        related: [...miniPostOperationQuery, 'date'],
    },
)

export const operationTagCloud = new Operation(
    queryTagCloud,
    [],
    'id',
    'title',
    'slug',
    'count',
    'hit',
)

export const operationFlickr = new Operation<{ id: string }>(
    queryFlickr,
    ['id'],
    'title',
    'link',
    'media',
)

export const operationArchive = new Operation<{
    type: TermTypes
    slug: string
    page: number
}>(
    queryArchive,
    ['type', 'slug', 'page'],
    ...commonOperationQuery,
    'excerpt',
    'total',
    'limit',
    'pages',
    'page',
    'type',
    {
        image: imageOperationQuery,
        posts: [
            ...miniPostOperationQuery,
            'date',
            'excerpt',
            {
                tags: [...commonOperationQuery, 'page', 'type'],
            },
        ],
    },
)

export const operationRecentPost = new Operation<{ id: string }>(
    queryRecent,
    [],
    ...miniPostOperationQuery,
)

const queries = new GraphQLQueries(
    queryBackgrounds,
    queryPost,
    queryMenu,
    queryArchive,
    queryFlickr,
    queryTagCloud,
    queryRecent,
)
export const graphqlSchema = getSchema(
    queries,
    ImageSize,
    Image,
    Images,
    MenuItem,
    PostMeta,
    Post,
    PrevNext,
    Term,
    FlickrImage,
    TagCloud,
)
