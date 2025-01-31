import { unstable_expireTag } from 'next/cache'
import { getOption } from '@src/db/mysql/getOption'
import { Cached } from '@common/model/Cached'

export const clearCache = async (nonce: string, slug: string) => {
    const option = await getOption('clear_cache')
    const nonceValue = option && option.option_value

    if (`${nonce}-${slug}` !== nonceValue) {
        const message = 'Clear cache got invalid nonce.'
        console.error(message)
        throw Error(message)
    }

    Cached.getInstance().flush()
    unstable_expireTag('wordpress', 'archive', 'page', 'post')

    return {
        result: true,
    }
}
