import express from 'express'
import http from 'http'
import cors from 'cors'

import Logger from '@src/utils/logger'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'

import typeDefs from '@src/schema/typeDefs.graphql'
import { connectToDatabase } from '@src/utils/mongo/connection'

import { recent } from '@src/resolvers/recent'
import { flickr } from '@src/resolvers/flickr'
import { tagCloud } from '@src/resolvers/tagCloud'
import { spectra } from '@src/resolvers/spectra'
import { prevNext } from '@src/resolvers/prevNext'
import { related } from '@src/resolvers/related'

import { numPages } from './resolvers/numPages'

import { archive, updateHits } from '@src/resolvers/archive'
import { post } from '@src/resolvers/post'
import { background } from '@src/resolvers/background'
import { flushDB, login } from '@src/resolvers/user'

import { IS_DEV } from '@sujin/share/constants/helper'
import { GQL_QUERY_TYPE } from '@sujin/lib/constants'
import type { GQL_ArchiveArg, GQL_PostArg } from '@sujin/lib/types'
import type { Context } from './types'

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        flickr,
        tagCloud,
        spectra,
        recent,
        prevNext,
        related,
        numPages,
        background: async (_: unknown, __: unknown, context: Context) => {
            return await background(GQL_QUERY_TYPE.QUERY, context)
        },
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
        login: async (_: unknown, { email }: { email: string }) => {
            return await login(email)
        },
        flushDB: async (_: unknown, __: unknown, context: Context) => {
            return await flushDB(context)
        },
        updateBackground: async (_: unknown, __: unknown, context: Context) => {
            return await background(GQL_QUERY_TYPE.UPDATE, context)
        },
        //post
        updatePosts: async (
            _: unknown,
            { category, page }: GQL_PostArg,
            context: Context,
        ) => {
            return await post(
                { category, page, query: GQL_QUERY_TYPE.UPDATE },
                context,
            )
        },
        removeSingle: async (
            _: unknown,
            { slug, postType }: GQL_PostArg,
            context: Context,
        ) => {
            return await post(
                { slug, postType, query: GQL_QUERY_TYPE.REMOVE },
                context,
            )
        },
        updateSingle: async (
            _: unknown,
            { slug, postType }: GQL_PostArg,
            context: Context,
        ) => {
            return await post(
                { slug, postType, query: GQL_QUERY_TYPE.UPDATE },
                context,
            )
        },
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
