import { unstable_expireTag } from 'next/cache'

import { Cached } from '@common/model/Cached'
import { getOption } from '@src/db/mysql/getOption'
import { removeOption } from '@src/db/mysql/removeOption'

export const clearCache = async (
    nonce: string,
    slug: string,
    id: number,
    categories: string,
    tags: string,
) => {
    const option = await getOption('remove_cache')
    const nonceValue = option && option.option_value

    if (`${nonce}-${slug}` !== nonceValue) {
        const message = 'Clear cache got invalid nonce.'
        console.error(message)
        throw Error(message)
    }

    const keys = [
        `post-${id}`,
        `post-${slug.toLowerCase()}`,
        ...categories.split(',').map((v) => `archive-category-${v}`),
        ...tags.split(',').map((v) => `archive-post_tag-${v}`),
    ]

    await Cached.getInstance().flush(keys)
    unstable_expireTag('wordpress', 'archive', 'page', 'post')
    await removeOption('remove_cache')

    return {
        result: true,
    }
}
