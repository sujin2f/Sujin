import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { NextRequest } from 'next/server'

import { getBackgrounds } from '@src/db/mongo/wordpress/background'
import { getFlickr } from '@src/db/mongo/flickr'
import { getTagCloud } from '@src/db/mongo/wordpress/tag-cloud'
import { getRecentPosts } from '@src/db/mongo/wordpress/recent-post'
import { clearCache } from '@src/db/mongo/wordpress/clear-cache'
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
    queryBackground,
    queryFlickr,
    queryTagCloud,
    queryRecent,
    mutateCache,
} from '@src/constants/graphql'
import { isEmpty } from '@common/utils/object'

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
    queryBackground.setCallback(getBackgrounds),
    queryFlickr.setCallback(getFlickr),
    queryTagCloud.setCallback(getTagCloud),
    queryRecent.setCallback(getRecentPosts),
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
        process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageDisabled()
            : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req, res) => {
        const headerReferer = ((
            req.headers as unknown as Record<string, string>
        ).referer || '') as string
        const referer = new URL(headerReferer).hostname
        const base = new URL(process.env.BASE_URL || '').hostname
        const dev = process.env.NODE_ENV === 'development'

        // Disallow different domain
        if (!dev && !referer.includes(base)) {
            throw Error('Access Denied.')
        }
        return { req, res }
    },
})

export default handler
