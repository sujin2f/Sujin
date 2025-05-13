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
    T_Archive,
    T_ArchivePost,
    T_Background,
    T_FlickrImage,
    T_Image,
    T_ImageBlock,
    T_ImageSize,
    T_Post,
    T_PostImages,
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
    mediumLarge: { type: Image },
    large: { type: Image },
    thumbnail: { type: Image },
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

export const PostMeta = new GQLType('PostMeta', {
    useBackgroundColor: { type: GQLBoolean },
    backgroundColor: { type: GQLString },
})

export const Post = new GQLType<T_Post>('Post', {
    id: { type: GQLInt },
    slug: { type: GQLString },
    title: { type: GQLString },
    excerpt: { type: GQLString },
    content: { type: GQLString },
    date: { type: GQLString },
    link: { type: GQLString },
    images: { type: Images },
    meta: { type: PostMeta },
})

export const Archive = new GQLType<T_Archive>('Term', {
    title: { type: GQLString },
    slug: { type: GQLString },
    type: { type: GQLString },
    total: { type: GQLInt },
    hits: { type: GQLInt },
    excerpt: { type: GQLString },
    image: { type: ImageBlock },
})

Post.addField('archives', { type: Archive, list })

export const queryBackgrounds = new GQLQuery<[], T_Background[]>(
    'backgrounds',
    {},
    {
        type: ImageBlock,
        list,
    },
)

export const queryRecent = new GQLQuery<[], T_ArchivePost[]>(
    'recent',
    {},
    {
        type: Post,
        list,
    },
)

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
    Archive,

    FlickrImage,
    TagCloud,
    Spectrum,
    Result,

    queryRecent,
    queryBackgrounds,
    queryFlickr,
    queryTagCloud,
    querySpectra,
    queryMongoSpectra,

    mutatePost,
    mutatePage,
    mutateBackground,
    mutateCategory,
    mutateTag,

    spectraOpr,
}

export default defaults
