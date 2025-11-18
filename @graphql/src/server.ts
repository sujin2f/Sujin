import express from 'express'
import http from 'http'
import cors from 'cors'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'

import Logger from '@src/utils/logger'
import { connectToDatabase } from '@src/utils/mongo/connection'

import { Mutation, Query } from '@src/resolvers'
import { typeDefs } from '@src/resolvers/typeDefs'

import { IS_DEV } from '@sujin/share/constants/helper'

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
        process.env.NODE_ENV === 'development'
            ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
            : ApolloServerPluginLandingPageDisabled(),
    ],
})

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

const authenticateUser = (req: express.Request): string => {
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
