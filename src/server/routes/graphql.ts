import { backgrounds } from 'src/utils/endpoints/backgrounds'
import { menu } from 'src/utils/endpoints/menu'
import { flickr } from 'src/utils/endpoints/flickr'
import { tagCloud } from 'src/utils/endpoints/tag-cloud'
import { post } from 'src/utils/endpoints/post'
import { archive } from 'src/utils/endpoints/archive'
import { recent } from 'src/utils/endpoints/recent'
import { createExpressRouter } from 'src/common/graphql/createExpressRouter'
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
    queryBackgrounds,
    queryPost,
    queryMenu,
    queryArchive,
    queryFlickr,
    queryTagCloud,
    queryRecent,
} from 'src/constants/graphql'

export const graphqlRouter = createExpressRouter(
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
    queryBackgrounds.setCallback(backgrounds),
    queryPost.setCallback(post),
    queryMenu.setCallback(menu),
    queryArchive.setCallback(archive),
    queryFlickr.setCallback(flickr),
    queryTagCloud.setCallback(tagCloud),
    queryRecent.setCallback(recent),
)
