import express from 'express'
import http from 'http'
import cors from 'cors'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'

import { Logger } from '@sujin/share/model/Logger'
import { connectToDatabase } from '@src/utils/mongo/connection'

import { Mutation, Query } from '@src/resolvers'
import { typeDefs } from '@src/resolvers/typeDefs'

import { IS_DEV } from '@sujin/share/constants/helper'
import { HEADER_TOKEN } from '@sujin/lib/constants'

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query,
    Mutation,
}

const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        IS_DEV ? ApolloServerPluginLandingPageLocalDefault({ footer: false }) : ApolloServerPluginLandingPageDisabled(),
    ],
})

const origin = process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : ['*']
const corsOptions = {
    origin,
    credentials: true,
    methods: ['POST'],
    allowedHeaders: ['Content-Type', HEADER_TOKEN],
}

const authenticateUser = (req: express.Request): string => {
    const authorizationHeader = req.headers[HEADER_TOKEN]
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
        express.json({ limit: '3mb' }),
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                return { token: authenticateUser(req), res }
            },
        }),
    )

    const port = process.env.SERVER_PORT
    // Modified server startup
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
    Logger.info(`🚀 @graphql Server ready at http://localhost:${port}`)
    await connectToDatabase()
}

start()
