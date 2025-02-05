import type { Image, Post } from '@src/types/wordpress'
import { MySQL } from '@src/db/mysql'
import { MySQLQuery } from '@src/constants/mysql-query'
import { getMedia } from '@src/db/mysql/getMedia'
import { Logger } from '@common/model/Logger'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { Cached } from '@common/model/Cached'

export const request = async (): Promise<Image[]> => {
    Logger.server('Access MySQL for getting backgrounds.')
    const result: Image[] = []
    const mysql = MySQL.getInstance()
    const query = MySQLQuery.getRandomBackgrounds()
    const posts = await mysql.select<Post>(query)

    for await (const post of posts) {
        const image = await getMedia(post.id)

        if (image) {
            result.push(image)
        }
    }

    if (!result.length) {
        throw Error(`Background is empty.`)
    }

    return result
}

export const getBackgrounds = async () =>
    await Cached.getInstance().getOrExecute(
        'backgrounds',
        async () => await request(),
        WEEK_IN_SECONDS,
    )
