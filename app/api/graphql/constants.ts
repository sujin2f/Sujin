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
    PropWithPages,
    T_Archive,
    T_FlickrImage,
    T_Recipe,
} from '@app/_lib/types'
import type { ISpectrum } from '@app/ether/data/types'
import { T_Mongo } from '@common/types/mongo'

const list = true
const required = true

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
 * Recipe
 */

const RecipeDetail = new GQLType<T_Recipe>('RecipeDetail', {
    title: { type: GQLString },
    amount: { type: GQLFloat },
    unit: { type: GQLString },
})

const Recipe = new GQLType<T_Recipe>('Recipe', {
    title: { type: GQLString },
    url: { type: GQLString },
    recipe: {
        type: RecipeDetail,
        list,
    },
    user: { type: GQLString },
})

const RecipeReturn = new GQLType<PropWithPages<T_Mongo<T_Recipe>>>(
    'RecipeReturn',
    {
        list: { type: Recipe, list },
        pages: { type: GQLInt },
    },
)

const queryRecipe = new GQLQuery<
    [boolean, number],
    PropWithPages<T_Mongo<T_Recipe>>
>(
    'recipe',
    {
        my: {
            type: GQLBoolean,
        },
        page: {
            type: GQLInt,
        },
    },
    {
        type: RecipeReturn,
    },
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
    FlickrImage,
    TagCloud,
    Spectrum,
    Result,

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

    Recipe,
    RecipeDetail,
    RecipeReturn,
    queryRecipe,
}

export default defaults
