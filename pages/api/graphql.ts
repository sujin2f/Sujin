import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import { ApolloServer } from '@apollo/server'
import { NextRequest } from 'next/server'

import { getBackgrounds } from '@src/db/mongo/wordpress/background'
import { getFlickr } from '@src/db/mongo/flickr'
import { getTagCloud } from '@src/db/mongo/wordpress/tag-cloud'
import { getRecentPosts } from '@src/db/mongo/wordpress/recent-post'
import { createGQLOptions } from '@common/data/graphql/createExpressRouter'
import {
    GQLImageSize,
    GQLImage,
    GQLImages,
    GQLMenuItem,
    GQLPostMeta,
    GQLPost,
    GQLPrevNext,
    GQLTerm,
    GQLFlickrImage,
    GQLTagCloud,
    queryBackground,
    queryFlickr,
    queryTagCloud,
    queryRecent,
} from '@src/constants/graphql'

const options = createGQLOptions(
    GQLImageSize,
    GQLImage,
    GQLImages,
    GQLMenuItem,
    GQLPostMeta,
    GQLPost,
    GQLPrevNext,
    GQLTerm,
    GQLFlickrImage,
    GQLTagCloud,
    queryBackground.setCallback(getBackgrounds),
    queryFlickr.setCallback(getFlickr),
    queryTagCloud.setCallback(getTagCloud),
    queryRecent.setCallback(getRecentPosts),
)

const resolvers = {
    Query: {
        ...options.rootValue,
    },
}

const server = new ApolloServer({
    typeDefs: options.schema,
    resolvers,
    cache: new InMemoryLRUCache({
        // ~100MiB
        maxSize: Math.pow(2, 20) * 100,
        // 5 minutes (in seconds)
        ttl: 300,
    }),
})

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => ({ req }),
})

export default handler
