import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import * as path from 'path'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'

import { typeDefs } from '@src/typeDefs'
import { connectToDatabase } from '@src/utils/mongo/connection'

import { getRecentPosts } from '@src/resolvers/query/getRecentPosts'
import { getBackgrounds } from '@src/resolvers/query/getBackgrounds'
import { getFlickr } from '@src/resolvers/query/getFlickr'
import { getTagCloud } from '@src/resolvers/query/getTagCloud'
// import { getSpectraFromNIST } from '@src/resolvers/query/spectra'

import { mutatePost } from '@src/resolvers/mutation/mutatePost'
import { mutatePage } from '@src/resolvers/mutation/mutatePage'
import { mutateBackground } from '@src/resolvers/mutation/mutateBackground'
import { mutateCategory } from '@src/resolvers/mutation/mutateCategory'
import { mutateTag } from '@src/resolvers/mutation/mutateTag'

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        recent: getRecentPosts,
        backgrounds: getBackgrounds,
        flickr: getFlickr,
        tagCloud: getTagCloud,
        // spectra: getSpectraFromNIST,
    },
    Mutation: {
        mutatePost,
        mutatePage,
        mutateBackground,
        mutateCategory,
        mutateTag,
    },
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
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

const start = async () => {
    await server.start()

    app.use(
        '/',
        cors<cors.CorsRequest>(corsOptions),
        express.json({ limit: '50mb' }),
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
        }),
    )
    // Modified server startup
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 4000 }, resolve),
    )
    console.log(`🚀 Server ready at http://localhost:4000/`)
    await connectToDatabase()
}

start()
