import Mongo from '@common/data/mongo/mongo'
import { PER_PAGE } from '@src/constants/mysql-query'
import type { Post } from '@src/types/wordpress'

const getPages = async (page: number = 1) =>
    await Mongo.findMany<Post>(
        'page',
        {},
        { sort: { date: -1 }, limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    )

export default getPages
