import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { NextRequest } from 'next/server'

import { getBackground } from '@src/db/mysql/getBackground'
import { getMenu } from '@src/db/mysql/getMenu'
import { getFlickr } from '@src/db/flickr/getFlickr'
import { getTagCloud } from '@src/db/mysql/getTagCloud'
import { getRecentPosts } from '@src/db/mysql/getRecentPosts'
import { getPost } from '@src/db/mysql/getPost'
import { getTermBy } from '@src/db/mysql/getTermBy'
import { createGQLOptions } from '@common/graphql/createExpressRouter'
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
    queryMenu,
    queryFlickr,
    queryTagCloud,
    queryRecent,
    queryPost,
    queryArchive,
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
    queryBackground.setCallback(getBackground),
    queryMenu.setCallback(getMenu),
    queryFlickr.setCallback(getFlickr),
    queryTagCloud.setCallback(getTagCloud),
    queryRecent.setCallback(getRecentPosts),
    queryPost.setCallback(getPost),
    queryArchive.setCallback(getTermBy),
)

const resolvers = {
    Query: {
        ...options.rootValue,
    },
}

const server = new ApolloServer({
    typeDefs: options.schema,
    resolvers,
})

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => ({ req }),
})

export default handler
