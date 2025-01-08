import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import { graphqlSchema } from '@constants/graphql'

import { backgrounds } from '@utils/endpoints/backgrounds'
import { menu } from '@utils/endpoints/menu'
import { flickr } from '@utils/endpoints/flickr'
import { tagCloud } from '@utils/endpoints/tag-cloud'
import { post } from '@utils/endpoints/post'
import { archive } from '@utils/endpoints/archive'
import { recent } from '@utils/endpoints/recent'

const graphqlRouter = express.Router()
const schema = buildSchema(graphqlSchema)

graphqlRouter.use(
    '/',
    graphqlHTTP({
        schema,
        rootValue: {
            post,
            archive,
            menu,
            backgrounds,
            flickr,
            tagCloud,
            recent,
        },
        graphiql: true,
    }),
)

export { graphqlRouter }
