import express from 'express'
import http from 'http'
import cors from 'cors'

import Logger from '@src/utils/logger'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'

import { typeDefs } from '@src/schema/typeDefs'
import { connectToDatabase } from '@src/utils/mongo/connection'

import { getRecentPosts } from '@src/resolvers/query/getRecentPosts'
import { getBackgrounds } from '@src/resolvers/query/getBackgrounds'
import { getFlickr } from '@src/resolvers/query/getFlickr'
import { getTagCloud } from '@src/resolvers/query/getTagCloud'
import { getSpectraFromNIST } from '@src/resolvers/query/spectra'
import { getArchivePosts } from '@src/resolvers/query/getArchivePosts'
import { getPrevNext } from '@src/resolvers/query/getPrevNext'
import { getRelatedPosts } from '@src/resolvers/query/getRelatedPosts'

import { mutatePost } from '@src/resolvers/mutation/mutatePost'
import { mutatePage } from '@src/resolvers/mutation/mutatePage'
import { mutateBackgrounds } from '@src/resolvers/mutation/mutateBackgrounds'
import { login } from '@src/resolvers/mutation/login'

import { IS_DEV } from '@sujin/share/constants/helper'
import { flushDB } from './resolvers/mutation/flushDB'
import { getPages } from './resolvers/query/getPages'
import { getNumPages } from './resolvers/query/getNumPages'
import { removePage } from './resolvers/mutation/removePage'
import { updatePostsFromWP } from './resolvers/mutation/updatePostsFromWP'
import { archive, updateHits } from './resolvers/archive'
import { post } from './resolvers/post'
import { GQL_ArchiveArg, GQL_PostArg } from '@sujin/lib/types'
import { Context } from './types'
import { GQL_QUERY_TYPE } from '@sujin/lib/constants'

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        recent: getRecentPosts,
        backgrounds: getBackgrounds,
        flickr: getFlickr,
        tagCloud: getTagCloud,
        spectra: getSpectraFromNIST,
        // post: getPost,
        archivePosts: getArchivePosts,
        numPages: getNumPages,
        prevNext: getPrevNext,
        related: getRelatedPosts,
        pages: getPages,

        // post
        post: async (
            _: unknown,
            { slug, postType, category, page }: GQL_PostArg,
            context: Context,
        ) => {
            return await post(
                { slug, postType, category, page, query: GQL_QUERY_TYPE.QUERY },
                context,
            )
        },
        // archive
        archive: async (
            _: unknown,
            { slug, archiveType, page }: GQL_ArchiveArg,
            context: Context,
        ) => {
            return await archive(
                { slug, archiveType, page, query: GQL_QUERY_TYPE.QUERY },
                context,
            )
        },
    },
    Mutation: {
        mutatePost,
        mutatePage,
        removePage,
        mutateBackgrounds,
        login,
        flushDB,
        updatePostsFromWP,
        // archive
        updateHits,
        updateArchive: async (
            _: unknown,
            { slug, archiveType }: GQL_ArchiveArg,
            context: Context,
        ) => {
            return await archive(
                { slug, archiveType, query: GQL_QUERY_TYPE.UPDATE },
                context,
            )
        },
        removeArchive: async (
            _: unknown,
            { slug, archiveType }: GQL_ArchiveArg,
            context: Context,
        ) => {
            return await archive(
                { slug, archiveType, query: GQL_QUERY_TYPE.REMOVE },
                context,
            )
        },
    },
}

// const loggerPlugin = {
//     async requestDidStart() {
//         return {
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             async didResolveOperation(context: any) {
//                 if (context.operation.operation === 'mutation') {
//                     Logger.info(`mutation`)
//                 } else if (context.operation.operation === 'query') {
//                     Logger.info(`query`)
//                 }
//             },
//         }
//     },
// }

const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        process.env.NODE_ENV === 'development'
            ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
            : ApolloServerPluginLandingPageDisabled(),
        // loggerPlugin,
    ],
})

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

const authenticateUser = (req: express.Request): string => {
    if (!process.env.JWT_SECRET) {
        return ''
    }
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return ''
    }
    return authorizationHeader.replace('Bearer ', '')
}

const start = async () => {
    await server.start()

    app.use(
        '/',
        cors<cors.CorsRequest>(corsOptions),
        express.json({ limit: '50mb' }),
        expressMiddleware(server, {
            context: async ({ req }) => {
                return { token: authenticateUser(req) }
            },
        }),
    )

    const port = IS_DEV ? 4000 : 80
    // Modified server startup
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
    Logger.info(`🚀 Server ready at http://localhost:${port}/`)
    await connectToDatabase()
}

start()
