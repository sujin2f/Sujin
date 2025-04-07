/* Models */
import { GQLMutation } from '@common/data/graphql/mutation'
import { GQLQuery } from '@common/data/graphql/query'
/* CONSTANTS */
import {
    GQLBoolean,
    GQLFloat,
    GQLInt,
    GQLString,
    GQLType,
} from '@common/data/graphql/type'
/* Types */
import type { FlickrImage as TypeFlickrImage } from '@app/_lib/data/flickr/type'
import type {
    ImageType,
    ImageBlockType,
    TermType,
    PostType,
    ArchiveType,
    ImageSizeType,
    ImagesType,
    TagType,
} from '@app/_lib/data/mysql/types'
import type { ISpectrum } from '@app/ether/data/types'

const list = true
const required = true

const Image = new GQLType<ImageType>('Image', {
    url: { type: GQLString },
    width: { type: GQLInt },
    height: { type: GQLInt },
    mimeType: { type: GQLString },
})

const ImageSize = new GQLType<ImageSizeType>('ImageSize', {
    medium: { type: Image },
    thumbnail: { type: Image },
    mediumLarge: { type: Image },
    postThumbnail: { type: Image },
    relatedPost: { type: Image },
    recentPost: { type: Image },
})

const ImageBlock = new GQLType<ImageBlockType>('ImageBlock', {
    url: { type: GQLString },
    mimeType: { type: GQLString },
    width: { type: GQLInt },
    height: { type: GQLInt },
    sizes: { type: ImageSize },
})

const Images = new GQLType<ImagesType>('Images', {
    list: { type: ImageBlock },
    icon: { type: ImageBlock },
    title: { type: ImageBlock },
    background: { type: ImageBlock },
    thumbnail: { type: ImageBlock },
})

const PostMeta = new GQLType('PostMeta', {
    useBackgroundColor: { type: GQLBoolean },
    backgroundColor: { type: GQLString },
})

const Post = new GQLType<PostType>('Post', {
    id: { type: GQLInt },
    slug: { type: GQLString },
    title: { type: GQLString },
    excerpt: { type: GQLString },
    content: { type: GQLString },
    date: { type: GQLFloat },
    link: { type: GQLString },
    images: { type: Images },
    meta: { type: PostMeta },
})

const PrevNext = new GQLType('PrevNext', {
    prev: { type: Post },
    next: { type: Post },
})

const Term = new GQLType<TermType>('Term', {
    id: { type: GQLInt },
    title: { type: GQLString },
    slug: { type: GQLString },
    type: { type: GQLString },
})

Post.addField('terms', { type: Term, list })

const FlickrImage = new GQLType<TypeFlickrImage>('FlickrImage', {
    title: { type: GQLString },
    link: { type: GQLString },
    media: { type: GQLString },
})

const TagCloud = new GQLType<ArchiveType>('TagCloud', {
    id: { type: GQLInt },
    title: { type: GQLString },
    slug: { type: GQLString },
    total: { type: GQLInt },
    hits: { type: GQLInt },
})

const queryArchivePosts = new GQLQuery<[string, string, number], PostType[]>(
    'archivePosts',
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
        type: Post,
        list,
    },
)

const queryFlickr = new GQLQuery<[], TypeFlickrImage[]>(
    'flickr',
    {},
    {
        type: FlickrImage,
        list,
    },
)

const queryTagCloud = new GQLQuery<[], TagType[]>(
    'tagCloud',
    {},
    {
        type: TagCloud,
        list,
    },
)

const queryRecent = new GQLQuery<[], PostType[]>(
    'recent',
    {},
    {
        type: Post,
        list,
    },
)

const queryPrevNext = new GQLQuery<[string], PostType[]>(
    'prevNext',
    {
        slug: {
            type: GQLString,
        },
    },
    {
        type: Post,
        list,
    },
)

const queryRelatedPosts = new GQLQuery<[string], PostType[]>(
    'relatedPosts',
    {
        slug: {
            type: GQLString,
        },
    },
    {
        type: Post,
        list,
    },
)

export type MutationResultType = {
    result: boolean
}

const Result = new GQLType<boolean>('Result', {
    result: { type: GQLBoolean },
})

const mutatePost = new GQLMutation<[string, string], MutationResultType>(
    'updatePost',
    {
        nonce: {
            type: GQLString,
            required,
        },
        slug: {
            type: GQLString,
            required,
        },
    },
    { type: Result },
)

const mutatePage = new GQLMutation<[string, string], MutationResultType>(
    'updatePage',
    {
        nonce: {
            type: GQLString,
            required,
        },
        slug: {
            type: GQLString,
            required,
        },
    },
    { type: Result },
)

const mutateBackground = new GQLMutation<[string], MutationResultType>(
    'updateBackground',
    {
        nonce: {
            type: GQLString,
            required,
        },
    },
    { type: Result },
)

const mutateCategory = new GQLMutation<[string, string], MutationResultType>(
    'updateCategory',
    {
        nonce: {
            type: GQLString,
            required,
        },
        slug: {
            type: GQLString,
            required,
        },
    },
    { type: Result },
)

const mutateTag = new GQLMutation<[string, string], MutationResultType>(
    'updateTag',
    {
        nonce: {
            type: GQLString,
            required,
        },
        slug: {
            type: GQLString,
            required,
        },
    },
    { type: Result },
)

const imageOpr = 'url width height mimeType'
const imageBlockOpr = `url mimeType width height sizes { medium { ${imageOpr} } thumbnail { ${imageOpr} } mediumLarge { ${imageOpr} } postThumbnail { ${imageOpr} } relatedPost { ${imageOpr} } recentPost { ${imageOpr} } }`
const imagesOpr = `list { ${imageBlockOpr} } thumbnail { ${imageBlockOpr} }`
const commonOpr = 'id slug title'
const taxOpr = `${commonOpr} type`
const miniPostOpr = `${commonOpr} link images { ${imagesOpr} }`
const postOpr = `${miniPostOpr} date excerpt content
    terms { ${taxOpr} }
    meta { useBackgroundColor backgroundColor }`

/**
 * @todo implement image maps
 */
export const archivePostsOperator = `
    id
    slug
    title
    date
    link
    images {
        list {
            url
            mimeType
            width
            height
            sizes {
                medium {
                    url
                    width
                    height
                    mimeType
                }
                thumbnail {}
                mediumLarge {}
                postThumbnail {}
                relatedPost {}
                recentPost {}
            }
        }
        thumbnail {
        }
    }
    terms {
        slug
        title
        type
    }
    meta {
        useBackgroundColor
        backgroundColor
    }
`

/**
 * Ether
 */
const Spectrum = new GQLType<ISpectrum>('Spectrum', {
    number: { type: GQLInt },
    ion: { type: GQLInt },
    energy: { type: GQLFloat },
    spin: { type: GQLFloat },
    l: { type: GQLString },
    parity: { type: GQLBoolean },
    j: { type: GQLFloat },
    base: { type: GQLFloat },
    conf: { type: GQLString, list },
    eConf: { type: GQLInt, list },
    ionReverse: { type: GQLInt },
    position: { type: GQLInt },
    term: { type: GQLString },
    orbital: { type: GQLString },
})

const querySpectra = new GQLQuery<[number, number], ISpectrum[]>(
    'spectra',
    {
        number: {
            type: GQLInt,
            required,
        },
        ion: {
            type: GQLInt,
            required,
        },
    },
    {
        type: Spectrum,
        list,
    },
)

const queryMongoSpectra = new GQLQuery<[string], ISpectrum[]>(
    'spectra_by_mongo',
    {
        schema: {
            type: GQLString,
            required,
        },
    },
    {
        type: Spectrum,
        list,
    },
)

const spectraOpr = `number ion energy spin l parity j base conf eConf ionReverse position term orbital`

const defaults = {
    Image,
    ImageSize,
    ImageBlock,
    Images,
    PostMeta,
    Post,
    PrevNext,
    Term,
    FlickrImage,
    TagCloud,
    Spectrum,
    Result,

    queryFlickr,
    queryTagCloud,
    queryRecent,
    queryPrevNext,
    queryRelatedPosts,
    queryArchivePosts,
    querySpectra,
    queryMongoSpectra,

    mutatePost,
    mutatePage,
    mutateBackground,
    mutateCategory,
    mutateTag,

    postOpr,
    spectraOpr,
}

export default defaults
