import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { NextRequest } from 'next/server'

import { getBackgrounds } from '@src/db/mysql/getBackgrounds'
import { getFlickr } from '@src/db/fetch/getFlickr'
import { getTagCloud } from '@src/db/mysql/getTagCloud'
import { getRecentPosts } from '@src/db/mysql/getPostsBy'
import { clearCache } from '@src/db/clear-cache'
import { createGQLOptions } from '@common/data/graphql/createExpressRouter'
import {
    GQLImageSize,
    GQLImage,
    GQLImages,
    GQLPostMeta,
    GQLPost,
    GQLPrevNext,
    GQLTerm,
    GQLFlickrImage,
    GQLTagCloud,
    GQLResult,
    GQLSpectrum,
    queryBackground,
    queryFlickr,
    queryTagCloud,
    queryRecent,
    mutateCache,
    querySpectra,
    queryMongoSpectra,
} from '@src/constants/graphql'
import { isEmpty } from '@common/utils/object'
import { BASE_URL, IS_DEV } from '@src/constants/system'
import {
    getSpectraFromNIST,
    getSpectraBySchema,
} from '@src/db/mongo/ether/spectra'

const options = createGQLOptions(
    GQLImageSize,
    GQLImage,
    GQLImages,
    GQLPostMeta,
    GQLPost,
    GQLPrevNext,
    GQLTerm,
    GQLFlickrImage,
    GQLTagCloud,
    GQLResult,
    GQLSpectrum,
    queryBackground.setCallback(getBackgrounds),
    queryFlickr.setCallback(getFlickr),
    queryTagCloud.setCallback(getTagCloud),
    queryRecent.setCallback(getRecentPosts),
    querySpectra.setCallback(getSpectraFromNIST),
    queryMongoSpectra.setCallback(getSpectraBySchema),
    mutateCache.setCallback(clearCache),
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
        // 5 minutes (in seconds)
        ttl: 300,
    }),
    plugins: [
        // Install a landing page plugin based on NODE_ENV
        IS_DEV
            ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
            : ApolloServerPluginLandingPageDisabled(),
    ],
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req, res) => {
        const headerReferer = ((
            req.headers as unknown as Record<string, string>
        ).referer || '') as string
        const referer = new URL(headerReferer).hostname
        const base = new URL(BASE_URL).hostname

        // Disallow different domain
        if (!IS_DEV && !referer.includes(base)) {
            throw Error('Access Denied.')
        }
        return { req, res }
    },
})

export default handler
