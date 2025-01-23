'use server'

import type { Image, Post } from '@src/types/wordpress'
import { MySQL } from '@src/db/mysql'
import { MySQLQuery } from '@src/constants/mysql-query'
import { getMedia } from '@src/db/mysql/getMedia'

export const getBackgrounds = async (): Promise<Image[]> => {
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

    return result
}
