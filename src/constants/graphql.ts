import { GQLQuery } from '@common/graphql/query'
import { GQLBoolean, GQLInt, GQLString, GQLType } from '@common/graphql/type'
import { FlickrImage } from '@src/types/flickr'
import { TermTypes } from '@src/types/wordpress'
import type {
    ImageSize,
    Image,
    Term,
    MenuItem,
    Post,
    TagCloud,
} from '@src/types/wordpress'

const list = true
const required = true

export const GQLImageSize = new GQLType<ImageSize>('ImageSize', {
    key: { type: GQLString },
    file: { type: GQLString },
})

export const GQLImage = new GQLType<Image>('Image', {
    url: { type: GQLString },
    mimeType: { type: GQLString },
    sizes: { type: GQLImageSize, list },
})

export const GQLImages = new GQLType('Images', {
    id: { type: GQLInt },
    list: { type: GQLImage },
    icon: { type: GQLImage },
    title: { type: GQLImage },
    background: { type: GQLImage },
    thumbnail: { type: GQLImage },
})

export const GQLMenuItem = new GQLType<MenuItem>('MenuItem', {
    id: { type: GQLInt },
    title: { type: GQLString },
    target: { type: GQLString },
    link: { type: GQLString },
    htmlClass: { type: GQLString, list },
})
GQLMenuItem.addField('children', { type: GQLMenuItem, list })

export const GQLPostMeta = new GQLType('PostMeta', {
    useBackgroundColor: { type: GQLBoolean },
    backgroundColor: { type: GQLString },
})

export const GQLPost = new GQLType<Post>('Post', {
    id: { type: GQLInt },
    slug: { type: GQLString },
    title: { type: GQLString },
    excerpt: { type: GQLString },
    content: { type: GQLString },
    date: { type: GQLString },
    link: { type: GQLString },
    parent: { type: GQLInt },
    type: { type: GQLString },
    menuOrder: { type: GQLInt },
    images: { type: GQLImages },
    meta: { type: GQLPostMeta },
})

export const GQLPrevNext = new GQLType('PrevNext', {
    prev: { type: GQLPost },
    next: { type: GQLPost },
})

export const GQLTerm = new GQLType<Term>('Term', {
    id: { type: GQLInt },
    title: { type: GQLString },
    slug: { type: GQLString },
    type: { type: GQLString },
    total: { type: GQLInt },
    limit: { type: GQLInt },
    pages: { type: GQLInt },
    excerpt: { type: GQLString },
    image: { type: GQLImage },
    posts: { type: GQLPost, list },
    page: { type: GQLInt },
})

GQLPost.addField('prevNext', { type: GQLPrevNext })
GQLPost.addField('tags', { type: GQLTerm, list })
GQLPost.addField('categories', { type: GQLTerm, list })
GQLPost.addField('series', { type: GQLTerm, list })
GQLPost.addField('related', { type: GQLPost, list })

export const GQLFlickrImage = new GQLType<FlickrImage>('FlickrImage', {
    title: { type: GQLString },
    link: { type: GQLString },
    media: { type: GQLString },
})

export const GQLTagCloud = new GQLType<TagCloud>('TagCloud', {
    id: { type: GQLInt },
    title: { type: GQLString },
    slug: { type: GQLString },
    count: { type: GQLInt },
    hit: { type: GQLInt },
})

export const queryBackground = new GQLQuery<[], Image>(
    'background',
    {},
    {
        type: GQLImage,
    },
)

export const queryPost = new GQLQuery<[string], Post>(
    'post',
    {
        slug: {
            type: GQLString,
            required,
        },
    },
    {
        type: GQLPost,
    },
)

export const queryMenu = new GQLQuery<[string], MenuItem[]>(
    'menu',
    {
        slug: {
            type: GQLString,
            required,
        },
    },
    {
        type: GQLMenuItem,
        list,
    },
)

export const queryArchive = new GQLQuery<[TermTypes, string, number], Term>(
    'archive',
    {
        type: {
            type: GQLString,
            required,
        },
        slug: {
            type: GQLString,
            required,
        },
        page: {
            type: GQLInt,
        },
    },
    {
        type: GQLTerm,
    },
)

export const queryFlickr = new GQLQuery<[], FlickrImage[]>(
    'flickr',
    {},
    {
        type: GQLFlickrImage,
        list,
    },
)

export const queryTagCloud = new GQLQuery<[], TagCloud[]>(
    'tagCloud',
    {},
    {
        type: GQLTagCloud,
        list,
    },
)

export const queryRecent = new GQLQuery<[], Post[]>(
    'recent',
    {},
    {
        type: GQLPost,
        list,
    },
)

export const imageOpr = 'url mimeType sizes { key file }'
const imagesOpr = `id list { ${imageOpr} } icon { ${imageOpr} } title { ${imageOpr} } background { ${imageOpr} } thumbnail { ${imageOpr} }`
export const menuItemOpr = 'id title target link htmlClass'
const commonOpr = 'id slug title'
const taxOpr = `${commonOpr} page type`
export const miniPostOpr = `${commonOpr} link images { ${imagesOpr} }`
export const menuOpr = `${menuItemOpr} children { ${menuItemOpr} }`
export const postOpr = `${miniPostOpr} date excerpt content parent type
    tags { ${taxOpr} }
    categories { ${taxOpr} }
    series { ${taxOpr} }
    meta { useBackgroundColor backgroundColor }
    prevNext { prev { ${commonOpr} link } next { ${commonOpr} link } }
    related { ${miniPostOpr} date }`
export const tagCloudOpr = 'id title slug count hit'
export const flickrOpr = 'title link media'
export const archiveOpr = `${commonOpr} excerpt total limit pages page type image { ${imageOpr} } posts { ${miniPostOpr} date excerpt tags { ${commonOpr} page type } }`
