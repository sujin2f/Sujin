import { MetaKeys, MySQLQuery } from 'src/constants/mysql-query'
import { Image, ImageSizes, Post } from 'src/types/wordpress'
import { getPostsBy } from 'src/utils/mysql/posts'
import { getPostMeta } from 'src/utils/mysql/post-meta'
import { Nullable } from 'src/types/common'
import { MySQL } from './mysqld'

type MediaRawData = {
    file: string
    sizes: Record<string, { file: string }>
}

export const getMedia = async (postId: number): Promise<Nullable<Image>> => {
    // MySQL query
    const post = await getPostsBy('id', postId, 1, true).then((data) =>
        data.length ? data[0] : undefined,
    )
    if (!post) {
        return undefined
    }

    const meta = await getPostMeta<Nullable<MediaRawData>>(
        postId,
        MetaKeys.ATTACHMENT_META,
        undefined,
    )
    if (!meta) {
        return undefined
    }

    // Map sizes
    const sizes: ImageSizes = []
    const url = post.link.replace(/[0-9]+\/[0-9]+\/.+$/, meta.file)
    if (meta.sizes) {
        Object.keys(meta.sizes).forEach((sizeKey) => {
            const postUrl = new URL(post.link)
            const path = postUrl.pathname.split('/')
            path.pop()

            const file = `${postUrl.origin}/${path
                .filter((v) => v)
                .join('/')}/${meta.sizes[sizeKey].file}`
            sizes.push({
                key: sizeKey,
                file,
            })
        })
    }

    const attachment: Image = {
        url,
        mimeType: post.mimeType,
        title: post.title,
        sizes,
    }

    return attachment
}

export const getBackgrounds = async (): Promise<Image[]> => {
    const posts: Post[] = await MySQL.getInstance().query<Post[]>(
        MySQLQuery.getRandomBackgrounds(),
        [],
    )

    const result: Image[] = []

    for (const post of posts) {
        const image = await getMedia(post.id).catch(() => undefined)

        if (image) {
            result.push(image)
        }
    }

    return result
}
