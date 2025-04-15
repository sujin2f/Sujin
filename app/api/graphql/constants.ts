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
/* T_Types */
import type {
    T_Image,
    T_ImageSize,
    T_ImageBlock,
    T_PostImages,
    T_Archive,
    T_PostArchive,
    T_PrevNext,
    T_FlickrImage,
} from '@app/_lib/types'
import type { ISpectrum } from '@app/ether/data/types'

const list = true
const required = true

const Image = new GQLType<T_Image>('Image', {
    url: { type: GQLString },
    width: { type: GQLInt },
    height: { type: GQLInt },
    mimeType: { type: GQLString },
})

const ImageSize = new GQLType<T_ImageSize>('ImageSize', {
    medium: { type: Image },
    thumbnail: { type: Image },
    mediumLarge: { type: Image },
    postThumbnail: { type: Image },
    relatedPost: { type: Image },
    recentPost: { type: Image },
})

const ImageBlock = new GQLType<T_ImageBlock>('ImageBlock', {
    url: { type: GQLString },
    mimeType: { type: GQLString },
    width: { type: GQLInt },
    height: { type: GQLInt },
    sizes: { type: ImageSize },
})

const Images = new GQLType<T_PostImages>('Images', {
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

const PostArchive = new GQLType<T_PostArchive>('PostArchive', {
    id: { type: GQLInt },
    slug: { type: GQLString },
    title: { type: GQLString },
    excerpt: { type: GQLString },
    date: { type: GQLFloat },
    link: { type: GQLString },
    images: { type: Images },
})

const PrevNext = new GQLType('PrevNext', {
    prev: { type: PostArchive },
    next: { type: PostArchive },
})

const FlickrImage = new GQLType<T_FlickrImage>('FlickrImage', {
    title: { type: GQLString },
    link: { type: GQLString },
    media: { type: GQLString },
})

const TagCloud = new GQLType<T_Archive>('TagCloud', {
    id: { type: GQLInt },
    title: { type: GQLString },
    slug: { type: GQLString },
    total: { type: GQLInt },
    hits: { type: GQLInt },
})

const queryFlickr = new GQLQuery<[], T_FlickrImage[]>(
    'flickr',
    {},
    {
        type: FlickrImage,
        list,
    },
)

const queryTagCloud = new GQLQuery<[], T_Archive[]>(
    'tagCloud',
    {},
    {
        type: TagCloud,
        list,
    },
)

const queryRecent = new GQLQuery<[], T_PostArchive[]>(
    'recent',
    {},
    {
        type: PostArchive,
        list,
    },
)

const queryPrevNext = new GQLQuery<[string], T_PrevNext[]>(
    'prevNext',
    {
        slug: {
            type: GQLString,
        },
    },
    {
        type: PostArchive,
        list,
    },
)

const queryRelatedPosts = new GQLQuery<[string], T_PostArchive[]>(
    'relatedPosts',
    {
        slug: {
            type: GQLString,
        },
    },
    {
        type: PostArchive,
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
    'mutatePost',
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
    'mutatePage',
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
    'mutateBackground',
    {
        nonce: {
            type: GQLString,
            required,
        },
    },
    { type: Result },
)

const mutateCategory = new GQLMutation<[string, string], MutationResultType>(
    'mutateCategory',
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
    'mutateTag',
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
const postOpr = `${miniPostOpr} date excerpt 
    terms { ${taxOpr} }`

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
    PostArchive,
    PrevNext,
    FlickrImage,
    TagCloud,
    Spectrum,
    Result,

    queryFlickr,
    queryTagCloud,
    queryRecent,
    queryPrevNext,
    queryRelatedPosts,
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
