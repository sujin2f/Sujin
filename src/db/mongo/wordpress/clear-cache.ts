import { unstable_expireTag } from 'next/cache'
import { getOption } from '@src/db/mysql/getOption'
import Mongo from '@common/data/mongo/mongo'

export const clearCache = async (
    nonce: string,
    slug: string,
    categories: string,
    tags: string,
) => {
    const option = await getOption('clear_cache')
    const nonceValue = option && option.option_value

    if (`${nonce}-${slug}` !== nonceValue) {
        const message = 'Clear cache got invalid nonce.'
        console.error(message)
        throw Error(message)
    }

    await Mongo.deleteMany('post', { slug: slug.toLowerCase() })
    categories.split(',').forEach((slug) =>
        Mongo.deleteMany('term', {
            slug: slug.toLowerCase(),
            type: 'category',
        }),
    )
    tags.split(',').forEach((slug) =>
        Mongo.deleteMany('term', {
            slug: slug.toLowerCase(),
            type: 'tag',
        }),
    )

    unstable_expireTag('wordpress', 'archive', 'page', 'post')

    return {
        result: true,
    }
}
