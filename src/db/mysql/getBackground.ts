'use server'

import { cache } from 'react'
import type { Image, Post } from '@src/types/wordpress'
import { MySQL } from '@src/db/mysql'
import { MySQLQuery } from '@src/constants/mysql-query'
import { getMedia } from '@src/db/mysql/getMedia'

const request = async (): Promise<Image[]> => {
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

const getBackgrounds = cache(async (): Promise<Image[]> => await request())

export const getBackground = async (): Promise<Image> => {
    const backgrounds = await getBackgrounds()

    return backgrounds && backgrounds.length
        ? backgrounds[Math.floor(Math.random() * backgrounds.length)]
        : ({} as Image)
}
