import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import type { NextRequest } from 'next/server'
/* Utils */
import { createGQLOptions } from '@common/data/graphql/createExpressRouter'
import { isEmpty } from '@common/utils/object'
import { getFlickr } from '@app/api/graphql/_lib/flickr/request'
import { getTagCloud } from '@app/api/graphql/_lib/getTagCloud'
import { getSpectraFromNIST } from '@app/ether/_lib/spectra'
import {
    mutateTag,
    mutatePost,
    mutatePage,
    mutateBackground,
    mutateCategory,
} from '@app/api/graphql/_lib/wp-mutates'
import { getBackgrounds } from '@app/api/graphql/_lib/getBackgrounds'
import { getCachedRecentPosts } from '@app/api/graphql/_lib/getCachedRecentPosts'
/* Constants */
import GQL from '@app/api/graphql/_lib/constants'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { MINUTE_IN_SECONDS } from '@common/constants/datetime'

const options = createGQLOptions(
    // Types
    GQL.FlickrImage,
    GQL.TagCloud,
    GQL.Result,
    GQL.Spectrum,
    GQL.Image,
    GQL.ImageSize,
    GQL.ImageBlock,
    GQL.Images,
    GQL.PostMeta,
    GQL.Post,
    GQL.Archive,
    // Queries
    GQL.queryRecent.setCallback(getCachedRecentPosts),
    GQL.queryBackgrounds.setCallback(getBackgrounds),
    GQL.queryFlickr.setCallback(getFlickr),
    GQL.queryTagCloud.setCallback(getTagCloud),
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
