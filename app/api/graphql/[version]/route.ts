import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import type { NextRequest } from 'next/server'
/* Utils */
import { getFlickr } from '@app/_lib/data/flickr/request'
import { createGQLOptions } from '@common/data/graphql/createExpressRouter'
import { isEmpty } from '@common/utils/object'
import { getSpectraFromNIST } from '@app/_lib/data/mongo/ether/spectra'
import {
    getCachedPrevNext,
    getCachedRecentPosts,
    getCachedRelatedPosts,
    mutatePost,
} from '@app/_lib/data/mongo/wordpress/post'
import { getTagCloud, mutateTag } from '@app/_lib/data/mongo/wordpress/tag'
/* Constants */
import GQL from '@app/api/graphql/constants'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { MINUTE_IN_SECONDS } from '@common/constants/datetime'
import { mutatePage } from '@app/_lib/data/mongo/wordpress/page'
import { mutateBackground } from '@app/_lib/data/mongo/wordpress/background'
import { mutateCategory } from '@app/_lib/data/mongo/wordpress/category'

const options = createGQLOptions(
    // Types
    GQL.Image,
    GQL.ImageSize,
    GQL.ImageBlock,
    GQL.Images,
    GQL.PostMeta,
    GQL.PostArchive,
    GQL.PrevNext,
    GQL.FlickrImage,
    GQL.TagCloud,
    GQL.Result,
    GQL.Spectrum,
    // Queries
    GQL.queryFlickr.setCallback(getFlickr),
    GQL.queryTagCloud.setCallback(getTagCloud),
    GQL.queryRecent.setCallback(getCachedRecentPosts),
    GQL.queryPrevNext.setCallback(getCachedPrevNext),
    GQL.queryRelatedPosts.setCallback(getCachedRelatedPosts),
    GQL.querySpectra.setCallback(getSpectraFromNIST),
    // Mutations
    GQL.mutatePost.setCallback(mutatePost),
    GQL.mutatePage.setCallback(mutatePage),
    GQL.mutateBackground.setCallback(mutateBackground),
    GQL.mutateCategory.setCallback(mutateCategory),
    GQL.mutateTag.setCallback(mutateTag),
)

const server = new ApolloServer({
    typeDefs: options.schema,
    resolvers: Object.entries(options.resolvers).reduce(
        (acc, [index, value]) => {
            if (isEmpty(value)) {
                return acc
            }

            return {
                ...acc,
                [index]: value,
            }
        },
        {},
    ),
    cache: new InMemoryLRUCache({
        // ~100MiB
        maxSize: Math.pow(2, 20) * 100,
        ttl: MINUTE_IN_SECONDS * 5,
    }),
    plugins: [
        // Install a landing page plugin based on NODE_ENV
        IS_DEV
            ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
            : ApolloServerPluginLandingPageDisabled(),
    ],
})

const handler = startServerAndCreateNextHandler(server)

export async function GET(request: NextRequest) {
    if (!request.url.endsWith(VERSION)) {
        return new Response(null, { status: 404 })
    }
    return handler(request)
}

export async function POST(request: NextRequest) {
    if (!request.url.endsWith(VERSION)) {
        return new Response(null, { status: 404 })
    }
    return handler(request)
}
