import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import { graphqlSchema } from 'src/constants/graphql'

import { backgrounds } from 'src/utils/graphql/backgrounds'
import { menu } from 'src/utils/graphql/menu'
import { flickr } from 'src/utils/graphql/flickr'
import { tagCloud } from 'src/utils/graphql/tag-cloud'
import { post } from 'src/utils/graphql/post'
import { archive } from 'src/utils/graphql/archive'
import { recent } from 'src/utils/graphql/recent'

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
