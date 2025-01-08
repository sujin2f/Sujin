import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import { graphqlSchema } from 'src/constants/graphql'

import { backgrounds } from 'src/utils/endpoints/backgrounds'
import { menu } from 'src/utils/endpoints/menu'
import { flickr } from 'src/utils/endpoints/flickr'
import { tagCloud } from 'src/utils/endpoints/tag-cloud'
import { post } from 'src/utils/endpoints/post'
import { archive } from 'src/utils/endpoints/archive'
import { recent } from 'src/utils/endpoints/recent'

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
