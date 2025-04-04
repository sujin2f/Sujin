// @todo Remove unused exports
/* Models */
import { GQLMutation } from '@common/data/graphql/mutation'
import { GQLQuery } from '@common/data/graphql/query'
/* Constants */
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
} from '@app/_lib/types/wordpress'
import type { ISpectrum } from '@app/ether/data/types'

const list = true
const required = true

const ImageSize = new GQLType<ImageType>('ImageSize', {
    key: { type: GQLString },
    file: { type: GQLString },
})

const Image = new GQLType<ImageBlockType>('Image', {
    url: { type: GQLString },
    mimeType: { type: GQLString },
    sizes: { type: ImageSize, list },
})

const Images = new GQLType('Images', {
    id: { type: GQLInt },
    list: { type: Image },
    icon: { type: Image },
    title: { type: Image },
    background: { type: Image },
    thumbnail: { type: Image },
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

const queryBackground = new GQLQuery<[], ImageBlockType[]>(
    'background',
    {},
    {
        type: Image,
        list,
    },
)

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

const queryTagCloud = new GQLQuery<[], ArchiveType[]>(
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

const mutateUpdatePost = new GQLMutation<[string, string], MutationResultType>(
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

const mutateUpdatePage = new GQLMutation<[string, string], MutationResultType>(
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

const mutateUpdateBackground = new GQLMutation<
    [string, number],
    MutationResultType
>(
    'updateBackground',
    {
        nonce: {
            type: GQLString,
            required,
        },
        id: {
            type: GQLInt,
            required,
        },
    },
    { type: Result },
)

const mutateUpdateCategory = new GQLMutation<
    [string, string],
    MutationResultType
>(
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

const mutateUpdateTag = new GQLMutation<[string, string], MutationResultType>(
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

const imageOpr = 'url mimeType sizes { key file }'
const imagesOpr = `id list { ${imageOpr} } icon { ${imageOpr} } title { ${imageOpr} } background { ${imageOpr} } thumbnail { ${imageOpr} }`
const menuItemOpr = 'id title target link htmlClass'
const commonOpr = 'id slug title'
const taxOpr = `${commonOpr} type`
const miniPostOpr = `${commonOpr} link images { ${imagesOpr} }`
const menuOpr = `${menuItemOpr} children { ${menuItemOpr} }`
const postOpr = `${miniPostOpr} date excerpt content
    terms { ${taxOpr} }
    meta { useBackgroundColor backgroundColor }`
const tagCloudOpr = 'id title slug total hits'
const flickrOpr = 'title link media'
const archiveOpr = `${commonOpr} excerpt total limit pages page type image { ${imageOpr} } posts { ${miniPostOpr} date excerpt tags { ${commonOpr} page type } }`

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
    ImageSize,
    Image,
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
    queryBackground,
    queryArchivePosts,
    querySpectra,
    queryMongoSpectra,

    mutateUpdatePost,
    mutateUpdatePage,
    mutateUpdateBackground,
    mutateUpdateCategory,
    mutateUpdateTag,

    imageOpr,
    menuItemOpr,
    miniPostOpr,
    menuOpr,
    postOpr,
    tagCloudOpr,
    flickrOpr,
    archiveOpr,
    spectraOpr,
}

export default defaults
