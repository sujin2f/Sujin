import { Types } from 'mongoose'
/* Models */
import { Logger } from '@common/model/Logger'
import { Archive } from '@src/schema/archive'
/* T_Types */
import type { T_RestPost } from '@common/types'
/* CONSTANTS */
import { REST_POSTS, ARCHIVE } from '@common/constants'
import { DAY_IN_MS } from '@common/constants/datetime'
/* Utils */
import { updateCategory } from '@src/utils/redis/actions/updateCategory'

export const getPost = async (slug: string) => {
    const requestURL = `${process.env.WP_REST_BASE_URL}/${REST_POSTS}/?slug=${slug}`

    return await fetch(requestURL, {
        method: 'GET',
        cache: 'no-cache',
    }).then(async (response) => {
        if (response.status !== 200) {
            Logger.error(`🤬 Failed to request REST post-slug -- ${requestURL}`)
            throw new Error(`🤬 Failed to request REST post-slug -- ${requestURL}`)
        }
        const json = (await response.json()) as T_RestPost[]
        const post = {
            title: json[0].title.rendered,
            link: json[0].link,
            id: json[0].id,
            slug: json[0].slug,
            excerpt: json[0].excerpt.rendered,
            content: json[0].content.rendered,
            date: Math.trunc(new Date(json[0].date).getTime() / DAY_IN_MS),
            images: json[0].images,
            status: json[0].status,
            meta: {
                backgroundColor: json[0].acf['background-color'],
            },
            archives: [] as Types.ObjectId[],
        }

        for (const [index, item] of json[0].archives.entries()) {
            await Archive.find({ slug: item.slug, type: item.type }).then(async (archive) => {
                if (archive.length) {
                    post.archives[index] = archive[0]._id
                    return
                }

                if (item.type === ARCHIVE.CATEGORY) {
                    const category = await updateCategory(item.slug)
                    post.archives[index] = new Types.ObjectId(category._id)
                    return
                }

                const tag = await Archive.insertOne(item)
                post.archives[index] = tag._id
            })
        }

        return post
    })
}
