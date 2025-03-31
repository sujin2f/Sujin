import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import type { NextRequest } from 'next/server'
/* Utils */
import { getBackgrounds } from '@src/db/mysql/getBackgrounds'
import { getFlickr } from '@src/db/fetch/getFlickr'
import { getTagCloud } from '@src/db/mysql/getTagCloud'
import getRecentPosts from '@src/db/mongo/wordpress/getRecentPosts'
import getPrevNext from '@src/db/mongo/wordpress/getPrevNext'
import getRelatedPosts from '@src/db/mongo/wordpress/getRelatedPosts'
import updatePost from '@src/db/mongo/wordpress/updatePost'
import updateTerm from '@src/db/mongo/wordpress/updateTerm'
import { createGQLOptions } from '@common/data/graphql/createExpressRouter'
import { isEmpty } from '@common/utils/object'
import {
    getSpectraFromNIST,
    getSpectraBySchema,
} from '@src/db/mongo/ether/spectra'
import { mongoMigration } from '@src/constants/mongo-migration'
import { migrateIndex } from '@common/data/mongo/mongo'
import getArchivePosts from '@src/db/mongo/wordpress/getArchivePosts'
/* Constants */
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
    queryPrevNext,
    queryRelatedPosts,
    mutateUpdatePost,
    querySpectra,
    queryMongoSpectra,
    mutateUpdateTerm,
    queryArchive,
} from '@src/constants/graphql'
import { IS_DEV } from '@common/constants/helper'
import { MINUTE_IN_SECONDS } from '@common/constants/datetime'

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
    queryPrevNext.setCallback(getPrevNext),
    queryRelatedPosts.setCallback(getRelatedPosts),
    querySpectra.setCallback(getSpectraFromNIST),
    queryArchive.setCallback(getArchivePosts),
    queryMongoSpectra.setCallback(getSpectraBySchema),
    mutateUpdatePost.setCallback(updatePost),
    mutateUpdateTerm.setCallback(updateTerm),
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
        // Custom Apollo Server Plugins
        {
            async serverWillStart() {
                // Migrate MongoDB indexes
                const version = process.env.VERSION || '0.0.0'
                await migrateIndex(version, mongoMigration)
            },
        },
    ],
})

const handler = startServerAndCreateNextHandler(server)

export async function GET(request: NextRequest) {
    return handler(request)
}

export async function POST(request: NextRequest) {
    return handler(request)
}
